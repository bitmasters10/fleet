const express = require('express');
const Router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('../mongo');
const Car = require('../models/Car');
const BookingEntry = require('../models/BookingEntry');
const Trip = require('../models/Trip');

function isAdmin(req, res, next) {
  return next();
}

async function idmake(table, column) {
  let id = uuidv4();
  const exists = await Car.findOne({ CAR_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

Router.post('/create-car', isAdmin, async (req, res) => {
  const { CAR_NO, COLOR, CAR_TYPE, MODEL_NAME, COMPANY_NAME, SEATING_CAPACITY } = req.body;
  const Id = await idmake('cars', 'CAR_ID');
  try {
    const newCar = await Car.create({
      CAR_ID: Id,
      CAR_NO,
      CAR_TYPE,
      MODEL_NAME,
      COLOR,
      COMPANY_NAME,
      SEATING_CAPACITY,
    });
    return res.status(200).json({ message: 'new car added', results: newCar });
  } catch (err) {
    console.error('Error creating car:', err);
    return res.status(500).send('Server Error');
  }
});

Router.get('/cars', isAdmin, async (req, res) => {
  try {
    const rows = await Car.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});

Router.get('/car/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findOne({ CAR_ID: id }).lean();
    if (!car) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json(car);
  } catch (err) {
    console.error('Error fetching car:', err);
    return res.status(500).send('Server Error');
  }
});

Router.delete('/car/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Car.findOneAndDelete({ CAR_ID: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json({ message: 'delete done', res: deleted });
  } catch (err) {
    console.error('Error deleting car:', err);
    return res.status(500).send('Server Error');
  }
});

Router.patch('/car/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { CAR_NO, COLOR, CAR_TYPE, MODEL_NAME, COMPANY_NAME, SEATING_CAPACITY, STATUS } = req.body;
  try {
    const updated = await Car.findOneAndUpdate(
      { CAR_ID: id },
      { CAR_NO, COLOR, CAR_TYPE, MODEL_NAME, COMPANY_NAME, SEATING_CAPACITY, STATUS },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json({ message: 'update done', res: updated });
  } catch (err) {
    console.error('Error updating car:', err);
    return res.status(500).send('Server Error');
  }
});

Router.patch('/car-status/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { STATUS } = req.body;
  try {
    const updated = await Car.findOneAndUpdate({ CAR_ID: id }, { STATUS }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json({ message: 'update done', res: updated });
  } catch (err) {
    console.error('Error updating car status:', err);
    return res.status(500).send('Server Error');
  }
});

Router.post('/avail-cars', isAdmin, async (req, res) => {
  const { date, start_time, end_time } = req.body;
  if (!date || !start_time || !end_time) {
    return res.status(400).send('All parameters (date, start_time, end_time) are required.');
  }
  try {
    const conflicts = await BookingEntry.find({
      DATE: date,
      $or: [
        { TIMING: { $lt: start_time }, END_TIME: { $gt: end_time } },
        { TIMING: { $lt: end_time }, END_TIME: { $gt: start_time } },
        { TIMING: { $gte: start_time }, END_TIME: { $lte: end_time } }
      ]
    }).lean();

    const busyCarIds = conflicts.map(c => c.CAR_ID).filter(Boolean);
    const available = await Car.find({ CAR_ID: { $nin: busyCarIds }, STATUS: 'ACTIVE' }, 'CAR_ID MODEL_NAME SEATING_CAPACITY').lean();
    return res.status(200).json(available);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Unexpected Server Error');
  }
});

Router.patch('/repair/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Car.findOneAndUpdate({ CAR_ID: id }, { STATUS: 'REPAIR' }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json({ message: 'SENT TO REPAIR done', res: updated });
  } catch (err) {
    console.error('Error setting repair status:', err);
    return res.status(500).send('Server Error');
  }
});

Router.patch('/work/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Car.findOneAndUpdate({ CAR_ID: id }, { STATUS: 'ACTIVE' }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json({ message: 'SET TO ACTIVE done', res: updated });
  } catch (err) {
    console.error('Error setting active status:', err);
    return res.status(500).send('Server Error');
  }
});

Router.get('/car-trip-stats', async (req, res) => {
  try {
    const stats = await Trip.aggregate([
      { $match: { STAT: 'COMPLETED' } },
      {
        $lookup: {
          from: 'bookingentries',
          localField: 'BOOK_ID',
          foreignField: 'BOOK_ID',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      { $group: { _id: '$booking.CAR_ID', completed_trips: { $sum: 1 } } },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: 'CAR_ID',
          as: 'car'
        }
      },
      { $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
      { $project: { CAR_ID: '$_id', MODEL_NAME: '$car.MODEL_NAME', completed_trips: 1 } }
    ]).exec();
    return res.status(200).json(stats);
  } catch (err) {
    console.error('Error fetching car trip stats:', err);
    return res.status(500).send('Server Error');
  }
});

module.exports = Router;

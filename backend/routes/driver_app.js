const express = require('express');
const Router = express.Router();
require('../mongo');
const { v4: uuidv4 } = require('uuid');
const BookingEntry = require('../models/BookingEntry');
const Trip = require('../models/Trip');
const Car = require('../models/Car');
const FuelConsumption = require('../models/FuelConsumption');
const Driver = require('../models/Driver');

async function idmake(table, column) {
  let id = uuidv4();
  const exists = await Trip.findOne({ TRIP_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

function isDriver(req, res, next) {
  if (!req.isAuthenticated() || !req.user) return res.status(401).json({ message: 'Unauthorized access.' });
  if (req.user.role !== 'driver') return res.status(403).json({ message: `Forbidden: You are not a driver (${req.user.role})` });
  return next();
}
Router.get('/book/:date', isDriver, async (req, res) => {
  const id = req.user.DRIVER_ID;
  const { date } = req.params;
  try {
    const dayStart = new Date(date); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(date); dayEnd.setHours(23,59,59,999);
    const results = await BookingEntry.find({ DRIVER_ID: id, DATE: { $gte: dayStart, $lte: dayEnd }, stat: 'READY' }).lean();
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.patch('/trip-complete', isDriver, async (req, res) => {
  const id = req.user.DRIVER_ID;
  const { BOOK_ID } = req.body;
  const now = new Date();
  const formattedTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const formattedDate = new Date();
  try {
    const updated = await Trip.findOneAndUpdate({ DRIVER_ID: id, BOOK_ID }, { STAT: 'COMPLETED', END_TIME: formattedTime, date: formattedDate }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'No matching trip found' });
    return res.json({ message: 'Trip marked as completed', results: updated });
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.post('/otp', isDriver, async (req, res) => {
  const { otp, BOOK_ID } = req.body;
  const id = req.user?.DRIVER_ID;
  if (!otp || !BOOK_ID || !id) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const trip = await Trip.findOne({ DRIVER_ID: id, OTP: otp, BOOK_ID }).lean();
    if (!trip) return res.status(404).json({ message: 'Incorrect OTP' });
    const updated = await Trip.findOneAndUpdate({ DRIVER_ID: id, BOOK_ID }, { STAT: 'ONGOING' }, { new: true }).lean();
    return res.status(200).json({ message: 'OTP verified', record: updated });
  } catch (err) {
    console.error('Database error during OTP check:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});



Router.get('/all/book', isDriver, async (req, res) => {
  const id = req.user.DRIVER_ID;
  try {
    const results = await BookingEntry.find({ DRIVER_ID: id, stat: 'READY' }).lean();
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.get('/cars', isDriver, async (req, res) => {
  try {
    const rows = await Car.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});
Router.post('/create-trip', isDriver, async (req, res) => {
  try {
    let ID = await idmake('trip', 'TRIP_ID');
    const { BOOK_NO, BOOK_ID, ROUTE, date } = req.body;
    const id = req.user.DRIVER_ID;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const START_TIME = `${now.getHours()}${now.getMinutes()}`;
    const tripDoc = { START_TIME, TRIP_ID: ID, BOOK_ID, BOOK_NO, ROUTE, OTP: otp, STAT: 'JUST', ROOM_ID: BOOK_ID, date: date ? new Date(date) : now, DRIVER_ID: id };
    await BookingEntry.findOneAndUpdate({ BOOK_ID }, { stat: 'TRIP' }).exec();
    const created = await Trip.create(tripDoc);
    return res.status(201).json({ message: 'Trip created successfully', trip: created });
  } catch (error) {
    console.error('Error in trip creation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
Router.get('/test', async (req, res) => {
  try {
    const results = await Trip.find({}, 'OTP').lean();
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.get('/history', isDriver, async (req, res) => {
  const id = req.user.DRIVER_ID;
  if (!id) return res.status(505).json({ error: 'driver not ready' });
  try {
    const results = await Trip.find({ DRIVER_ID: id, STAT: 'COMPLETED' }).lean();
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.get('/drive/fuel', isDriver, async (req, res) => {
  const id = req.user.DRIVER_ID;
  if (!id) return res.status(505).json({ error: 'driver not ready' });
  try {
    const results = await FuelConsumption.find({ DRIVER_ID: id }).lean();
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.post('/myloc', async (req, res) => {
  const { lat, long } = req.body;
  const id = req.user.DRIVER_ID;
  try {
    const updated = await Driver.findOneAndUpdate({ DRIVER_ID: id }, { LATITUDE: lat, LONGITUDE: long }, { new: true }).lean();
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Error during update:', err);
    return res.status(500).send('Server Error');
  }

});
// Router.post("/create-fuel", upload.single("photo"), async (req, res) => {
//   try {
//     // Generate a unique F_ID
//     const F_ID = await idmake("FUEL_CONSUMPTION", "F_ID");

//     const { CAR_ID,  DATE, COST } = req.body;
//     const DRIVER_ID=req.user.DRIVER_ID;

//     // Check if the photo file is uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: "Photo is required" });
//     }

//     // Convert the photo file to a buffer
//     const PHOTO = req.file.buffer;

//     // Create the fuel consumption record
//     const query =
//       "INSERT INTO FUEL_CONSUMPTION (F_ID, CAR_ID, DRIVER_ID, DATE, COST, PHOTO) VALUES (?, ?, ?, ?, ?, ?)";
//     const values = [F_ID, CAR_ID, DRIVER_ID, DATE, COST, PHOTO];

//     db.query(query, values, (err, results) => {
//       if (err) {
//         console.error("Error executing query:", err);
//         return res.status(500).json({ error: "Database insertion failed" });
//       }

//       // Respond with the created record's ID and status
//       return res.status(201).json({ message: "Fuel consumption record created", F_ID });
//     });
//   } catch (error) {
//     console.error("Error in /create-fuel:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });
Router.get('/fuels', async (req, res) => {
  const DRIVER_ID = req.user.DRIVER_ID;
  try {
    const rows = await FuelConsumption.find({ DRIVER_ID }).lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});
Router.get('/curr-trips', async (req, res) => {
  try {
    const driverId = req.user.DRIVER_ID;
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const results = await Trip.find({ DRIVER_ID: driverId, STAT: { $in: ['JUST','ONGOING'] }, date: { $gte: start, $lte: end } }).lean();
    return res.json(results);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = Router;

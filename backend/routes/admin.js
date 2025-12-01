const express = require('express');
const Router = express.Router();
require('../mongo');
const Admin = require('../models/Admin');
const FuelConsumption = require('../models/FuelConsumption');
const Trip = require('../models/Trip');
const BookingEntry = require('../models/BookingEntry');
const Car = require('../models/Car');
const Driver = require('../models/Driver');
function isSuperAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    console.log('User is not authenticated');
    return res.status(401).json({ message: 'Unauthorized access.' });
  }

  if (req.user.role !== 'superadmin') {
    console.log('User role is not superadmin:', req.user.role);
    return res.status(403).json({ message: 'Forbidden: You are not a superadmin.' });
  }

  return next();
}
Router.get('/admins', isSuperAdmin, async (req, res) => {
  try {
    const rows = await Admin.find({ role: 'admin' }).lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});

Router.get('/admin/:id', isSuperAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findOne({ aid: id }).lean();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    return res.status(200).json(admin);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).send('Server Error');
  }
});
Router.delete('/admin/:id', isSuperAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Admin.findOneAndDelete({ aid: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Admin not found' });
    return res.status(200).json({ message: 'delete done', res: deleted });
  } catch (err) {
    console.error('Error deleting admin:', err);
    return res.status(500).send('Server Error');
  }
});

Router.patch('/admin/:id', isSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { aname, email } = req.body;
  try {
    const updated = await Admin.findOneAndUpdate({ aid: id }, { aname, email }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Admin not found' });
    return res.status(200).json({ message: 'update done', res: updated });
  } catch (err) {
    console.error('Error updating admin:', err);
    return res.status(500).send('Server Error');
  }
});

Router.get('/monthly-report/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const formattedMonth = month.padStart(2, '0');
    const startDate = new Date(`${year}-${formattedMonth}-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-${formattedMonth}-31T23:59:59.999Z`);

    const fuelCostRes = await FuelConsumption.aggregate([
      { $match: { DATE: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total_fuel_cost: { $sum: '$COST' } } }
    ]).exec();

    const fuelPerVehicle = await FuelConsumption.aggregate([
      { $match: { DATE: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$CAR_ID', fuel_cost: { $sum: '$COST' } } },
      { $lookup: { from: 'cars', localField: '_id', foreignField: 'CAR_ID', as: 'car' } },
      { $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
      { $project: { CAR_ID: '$_id', CAR_NO: '$car.CAR_NO', MODEL_NAME: '$car.MODEL_NAME', fuel_cost: 1 } }
    ]).exec();

    const totalBookingsRes = await BookingEntry.countDocuments({ DATE: { $gte: startDate, $lte: endDate } }).exec();

    const totalTripsRes = await Trip.countDocuments({ date: { $gte: startDate, $lte: endDate }, STAT: 'COMPLETED' }).exec();

    const tripsPerVehicle = await Trip.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate }, STAT: 'COMPLETED' } },
      { $lookup: { from: 'bookingentries', localField: 'BOOK_ID', foreignField: 'BOOK_ID', as: 'booking' } },
      { $unwind: '$booking' },
      { $group: { _id: '$booking.CAR_ID', trips_completed: { $sum: 1 } } },
      { $lookup: { from: 'cars', localField: '_id', foreignField: 'CAR_ID', as: 'car' } },
      { $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
      { $project: { CAR_ID: '$_id', CAR_NO: '$car.CAR_NO', MODEL_NAME: '$car.MODEL_NAME', trips_completed: 1 } }
    ]).exec();

    const tripsPerDriver = await Trip.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate }, STAT: 'COMPLETED' } },
      { $group: { _id: '$DRIVER_ID', trips_completed: { $sum: 1 } } },
      { $lookup: { from: 'drivers', localField: '_id', foreignField: 'DRIVER_ID', as: 'driver' } },
      { $unwind: { path: '$driver', preserveNullAndEmptyArrays: true } },
      { $project: { DRIVER_ID: '$_id', NAME: '$driver.NAME', trips_completed: 1 } }
    ]).exec();

    // Enrich drivers with fuel cost
    const driverIds = tripsPerDriver.map(d => d.DRIVER_ID).filter(Boolean);
    const fuelByDriver = await FuelConsumption.aggregate([
      { $match: { DRIVER_ID: { $in: driverIds }, DATE: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$DRIVER_ID', total_fuel_cost: { $sum: '$COST' } } }
    ]).exec();

    const fuelMap = fuelByDriver.reduce((acc, cur) => { acc[cur._id] = cur.total_fuel_cost; return acc; }, {});

    const tripsPerDriverEnriched = tripsPerDriver.map(d => ({ ...d, total_fuel_cost: fuelMap[d.DRIVER_ID] || 0 }));

    return res.status(200).json({
      month: `${year}-${formattedMonth}`,
      total_fuel_cost: fuelCostRes[0]?.total_fuel_cost || 0,
      total_bookings: totalBookingsRes || 0,
      total_trips: totalTripsRes || 0,
      fuel_per_vehicle: fuelPerVehicle,
      trips_per_vehicle: tripsPerVehicle,
      trips_per_driver: tripsPerDriverEnriched
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
  Router.post("/generate-pdf", (req, res) => {
    const { reportData } = req.body;
  
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();
  
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly-report-${reportData.month}.pdf`
    );
  
    doc.pipe(res);
  
    // Add title
    doc.fontSize(25).text(`Monthly Report: ${reportData.month}`, 100, 80);
  
    // Add key metrics
    doc.fontSize(14).text(`Total Fuel Cost: ₹${reportData.total_fuel_cost}`, 100, 150);
    doc.text(`Total Bookings: ${reportData.total_bookings}`, 100, 170);
    doc.text(`Total Trips: ${reportData.total_trips}`, 100, 190);
  
    // Add fuel cost per vehicle
    doc.moveDown();
    doc.fontSize(16).text("Fuel Cost Per Vehicle:", 100, 220);
    reportData.fuel_per_vehicle.forEach((vehicle, index) => {
      doc.text(
        `${vehicle.CAR_NO} (${vehicle.MODEL_NAME}): ₹${vehicle.fuel_cost}`,
        120,
        240 + index * 20
      );
    });
  
    // Add trips per vehicle
    doc.moveDown();
    doc.fontSize(16).text("Trips Per Vehicle:", 100, 340);
    reportData.trips_per_vehicle.forEach((vehicle, index) => {
      doc.text(
        `${vehicle.CAR_NO} (${vehicle.MODEL_NAME}): ${vehicle.trips_completed} trips`,
        120,
        360 + index * 20
      );
    });
  
    // Add trips per driver
    doc.moveDown();
    doc.fontSize(16).text("Trips Per Driver:", 100, 460);
    reportData.trips_per_driver.forEach((driver, index) => {
      doc.text(
        `${driver.NAME}: ${driver.trips_completed} trips (Fuel Cost: ₹${driver.total_fuel_cost})`,
        120,
        480 + index * 20
      );
    });
  
    doc.end();
  });
module.exports = Router;
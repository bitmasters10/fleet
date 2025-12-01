const express = require('express');
const Router = express.Router();
require('../mongo');
const Trip = require('../models/Trip');
const BookingEntry = require('../models/BookingEntry');
const { v4: uuidv4 } = require('uuid');

async function idmake(table, column) {
  let id = uuidv4();
  const exists = await Trip.findOne({ TRIP_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

function isAdmin(req, res, next) {


  if (!req.isAuthenticated() || !req.user) {
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    console.log("User role is not admin:", req.user.role);
    return res.status(403).json({ message: "Forbidden: You are not a admin." });
  }

  console.log("Role verified:", req.user.role);
  return next(); // Proceed if authenticated and role is superadmin
}


Router.post('/create-trip', async (req, res) => {
  try {
    let ID = await idmake('trip', 'TRIP_ID');
    const { BOOK_NO, BOOK_ID, ROUTE, date } = req.body;
    const id = req.user?.DRIVER_ID || null;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const START_TIME = `${now.getHours()}${now.getMinutes()}`;

    const tripDoc = {
      START_TIME,
      TRIP_ID: ID,
      BOOK_ID,
      BOOK_NO,
      ROUTE,
      OTP: otp,
      STAT: 'JUST',
      ROOM_ID: BOOK_ID,
      date: date ? new Date(date) : now,
      DRIVER_ID: id,
    };

    // Update related booking entry stat
    await BookingEntry.findOneAndUpdate({ BOOK_ID }, { stat: 'TRIP' }).exec();

    // Create trip
    const created = await Trip.create(tripDoc);
    return res.status(201).json({ message: 'Trip created successfully', trip: created });
  } catch (error) {
    console.error('Error in trip creation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
 
Router.get('/trips', isAdmin, async (req, res) => {
  try {
    const rows = await Trip.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});


Router.get('/location', async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const rows = await Trip.find({ date: { $gte: start, $lte: end } }, 'ROOM_ID').lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});
Router.get('/curr-trips', async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const results = await Trip.find({ STAT: { $in: ['JUST','ONGOING'] }, date: { $gte: start, $lte: end } }).lean();
    return res.json(results);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = Router;

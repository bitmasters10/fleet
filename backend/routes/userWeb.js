const express = require('express');
const Router = express.Router();
require('../mongo');
const Trip = require('../models/Trip');

function isDriver(req, res, next) {
  if (!req.isAuthenticated() || !req.user) return res.status(401).json({ message: 'Unauthorized access.' });
  if (req.user.role !== 'driver') return res.status(403).json({ message: `Forbidden: You are not a driver (${req.user.role})` });
  return next();
}

Router.get('/book/:id/:date', async (req, res) => {
  const { id, date } = req.params;
  try {
    const dayStart = new Date(date); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(date); dayEnd.setHours(23,59,59,999);
    const trips = await Trip.find({ BOOK_ID: id, date: { $gte: dayStart, $lte: dayEnd } }, 'OTP').lean();
    return res.json(trips);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = Router;

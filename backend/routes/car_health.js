const express = require('express');
const Router = express.Router();
require('../mongo');
const CarHealth = require('../models/CarHealth');
const { v4: uuidv4 } = require('uuid');


function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }
  return next();
}


async function idmake(table, column) {
  let id = uuidv4();
  const exists = await CarHealth.findOne({ HEALTH_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}


Router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { CAR_ID, RATING, MESSAGE, STATUS, LAST_MAINTENANCE, TIME_STAMP, DESCRIPTION } = req.body;

    // Fix: Ensure DESCRIPTION is checked properly
    if (!CAR_ID || !RATING || !MESSAGE || !STATUS || !LAST_MAINTENANCE || !TIME_STAMP || !DESCRIPTION) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const HEALTH_ID = await idmake('car_health', 'HEALTH_ID');
    const DRIVER_ID = req.user?.DRIVER_ID;
    const doc = new CarHealth({ HEALTH_ID, CAR_ID, RATING, DRIVER_ID, MESSAGE, STAT: STATUS, LAST_MAINTENANCE, TIME_STAMP, DESCRIPTION });
    await doc.save();
    res.status(201).json({ message: 'Car health record added', HEALTH_ID });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



Router.get("/", isAuthenticated, async (req, res) => {
  try {
    const results = await CarHealth.find().lean();
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.get("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const record = await CarHealth.findOne({ HEALTH_ID: id }).lean();
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.put("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { RATING, MESSAGE, STATUS } = req.body;

  if (RATING === undefined || MESSAGE === undefined || STATUS === undefined) {
    return res.status(400).json({ message: "Only RATING, MESSAGE, and STATUS can be updated." });
  }

  try {
    const updated = await CarHealth.findOneAndUpdate({ HEALTH_ID: id }, { RATING, MESSAGE, STAT: STATUS }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Car health record updated', record: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await CarHealth.findOneAndDelete({ HEALTH_ID: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Car health record deleted', record: deleted });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});

module.exports = Router;

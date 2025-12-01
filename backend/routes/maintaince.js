const express = require('express');
const Router = express.Router();
require('../mongo');
const Maintenance = require('../models/Maintenance');
const { v4: uuidv4 } = require('uuid');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You are not an admin." });
  }

  return next();
}

// Function to generate a unique ID
async function idmake(table, column) {
  let id = uuidv4();
  const exists = await Maintenance.findOne({ M_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}


Router.post("/", isAdmin, async (req, res) => {
  try {
    const { CAR_ID, DATE, DESCRIPTION } = req.body;
    if (!CAR_ID || !DATE || !DESCRIPTION) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const M_ID = await idmake('maintenance', 'M_ID');
    const doc = new Maintenance({ M_ID, CAR_ID, DATE: new Date(DATE), DESCRIPTION });
    await doc.save();
    res.status(201).json({ message: 'Maintenance record added', M_ID });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});


Router.get("/", isAdmin, async (req, res) => {
  try {
    const results = await Maintenance.find().lean();
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.get("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Maintenance.findOne({ M_ID: id }).lean();
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { CAR_ID, DATE, DESCRIPTION } = req.body;

  if (!CAR_ID || !DATE || !DESCRIPTION) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updated = await Maintenance.findOneAndUpdate({ M_ID: id }, { CAR_ID, DATE: new Date(DATE), DESCRIPTION }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Maintenance record updated', record: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});

Router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Maintenance.findOneAndDelete({ M_ID: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Maintenance record deleted', record: deleted });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});

module.exports = Router;

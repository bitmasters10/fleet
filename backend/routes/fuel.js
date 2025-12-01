const express = require('express');
const Router = express.Router();
require('../mongo');
const FuelConsumption = require('../models/FuelConsumption');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

async function idmake(table, column) {
  let id = uuidv4();
  const exists = await FuelConsumption.findOne({ F_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

const path = require("path"); 
const fs = require("fs");

// Multer setup for photo uploads
const storage = multer.memoryStorage(); // Store files in memory as a Buffer
const upload = multer({ storage });




Router.post('/create-fuel', upload.single('photo'), async (req, res) => {
  try {
    
    // Generate a unique F_ID
    const F_ID = await idmake("fuel_consumption", "F_ID");

    const { CAR_ID,  DATE, COST } = req.body;
    const DRIVER_ID=req.user.DRIVER_ID;

    // Check if the photo file is uploaded
    if (!req.file) {
      console.log("nhi aya")
      return res.status(400).json({ error: "Photo is required" });
    }

    // Convert the photo file to a buffer
    const PHOTO = req.file.buffer;

    const doc = new FuelConsumption({ F_ID, CAR_ID, DRIVER_ID, DATE: DATE ? new Date(DATE) : new Date(), COST, PHOTO });
    await doc.save();
    return res.status(201).json({ message: 'Fuel consumption record created', F_ID });
  } catch (error) {
    console.error("Error in /create-fuel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
Router.patch('/accept/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await FuelConsumption.findOneAndUpdate({ F_ID: id }, { stat: 'accepted' }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.patch('/reject/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await FuelConsumption.findOneAndUpdate({ F_ID: id }, { stat: 'rejected' }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});
Router.get('/fuels', async (req, res) => {
  try {
    const rows = await FuelConsumption.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});
Router.get('/fuel-cost-per-month', async (req, res) => {
  try {
    const results = await FuelConsumption.aggregate([
      { $match: { stat: 'accepted' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$DATE' } }, total_cost: { $sum: '$COST' } } },
      { $project: { month: '$_id', total_cost: 1, _id: 0 } },
      { $sort: { month: 1 } }
    ]).exec();
    return res.json(results);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = Router;
const express = require('express');
const Router = express.Router();
require('../mongo');
const Insurance = require('../models/Insurance');
const { v4: uuidv4 } = require('uuid');


function isAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You are not an admin." });
  }

  return next();
}


async function idmake(table, column) {
  let id = uuidv4();
  const exists = await Insurance.findOne({ IN_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}


Router.post("/", isAdmin, async (req, res) => {
  try {
    const { CAR_ID, INSURANCE_NO, OTHER_DETAIL } = req.body;
    if (!CAR_ID || !INSURANCE_NO || !OTHER_DETAIL) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const IN_ID = await idmake('INSURANCE', 'IN_ID');
    const doc = new Insurance({ IN_ID, CAR_ID, INSURANCE_NO, OTHER_DETAIL });
    await doc.save();
    res.status(201).json({ message: 'Insurance record added', IN_ID });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});


Router.get("/", isAdmin, async (req, res) => {
  try {
    const results = await Insurance.find().lean();
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.get("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Insurance.findOne({ IN_ID: id }).lean();
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { CAR_ID, INSURANCE_NO, OTHER_DETAIL } = req.body;

  if (!CAR_ID || !INSURANCE_NO || !OTHER_DETAIL) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updated = await Insurance.findOneAndUpdate({ IN_ID: id }, { CAR_ID, INSURANCE_NO, OTHER_DETAIL }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Insurance record updated', record: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});


Router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Insurance.findOneAndDelete({ IN_ID: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Insurance record deleted', record: deleted });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
});

module.exports = Router;

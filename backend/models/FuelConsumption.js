const mongoose = require('mongoose');

const FuelConsumptionSchema = new mongoose.Schema({
  F_ID: { type: String, required: true, unique: true },
  CAR_ID: { type: String, required: true },
  DRIVER_ID: { type: String },
  DATE: { type: Date },
  COST: { type: Number },
  PHOTO: { type: Buffer },
  stat: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('FuelConsumption', FuelConsumptionSchema);

const mongoose = require('mongoose');

const CarHealthSchema = new mongoose.Schema({
  HEALTH_ID: { type: String, required: true, unique: true },
  CAR_ID: { type: String, required: true },
  RATING: { type: Number, required: true },
  DRIVER_ID: { type: String },
  MESSAGE: { type: String },
  STATUS: { type: String },
  LAST_MAINTENANCE: { type: Date },
  TIME_STAMP: { type: Date },
  DESCRIPTION: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CarHealth', CarHealthSchema);

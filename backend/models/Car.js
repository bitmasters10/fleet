const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  CAR_ID: { type: String, required: true, unique: true },
  CAR_NO: { type: String },
  COLOR: { type: String },
  CAR_TYPE: { type: String },
  MODEL_NAME: { type: String },
  COMPANY_NAME: { type: String },
  SEATING_CAPACITY: { type: Number },
  STATUS: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);

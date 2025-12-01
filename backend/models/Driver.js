const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  DRIVER_ID: { type: String, required: true, unique: true },
  NAME: { type: String, required: true },
  EMAIL_ID: { type: String },
  LICENSE_NO: { type: String },
  GENDER: { type: String },
  LATITUDE: { type: Number },
  LONGITUDE: { type: Number },
  ADHARCARD: { type: Buffer },
  PANCARD: { type: Buffer },
  ROLE: { type: String, default: 'driver' },
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);

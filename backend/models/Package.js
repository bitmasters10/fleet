const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  PID: { type: String, required: true, unique: true },
  PROD_ID: { type: String },
  NAME: { type: String },
  PLACES: { type: Number },
  DURATION: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);

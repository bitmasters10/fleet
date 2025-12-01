const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  M_ID: { type: String, required: true, unique: true },
  CAR_ID: { type: String, required: true },
  DATE: { type: Date, required: true },
  DESCRIPTION: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);

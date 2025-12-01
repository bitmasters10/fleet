const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  IN_ID: { type: String, required: true, unique: true },
  CAR_ID: { type: String },
  INSURANCE_NO: { type: String },
  OTHER_DETAIL: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Insurance', InsuranceSchema);

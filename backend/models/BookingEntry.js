const mongoose = require('mongoose');

const BookingEntrySchema = new mongoose.Schema({
  BOOK_ID: { type: String, required: true, unique: true },
  TIMING: { type: String },
  PICKUP_LOC: { type: String },
  CAR_ID: { type: String },
  USER_ID: { type: String },
  BOOK_NO: { type: String },
  DATE: { type: Date },
  NO_OF_PASSENGER: { type: Number },
  PACKAGE_ID: { type: String },
  DROP_LOC: { type: String },
  AC_NONAC: { type: String },
  stat: { type: String },
  END_TIME: { type: String },
  VID: { type: String },
  DRIVER_ID: { type: String },
  mobile_no: { type: String },
  br: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BookingEntry', BookingEntrySchema);

const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  TRIP_ID: { type: String, required: true, unique: true },
  START_TIME: { type: String },
  BOOK_ID: { type: String },
  BOOK_NO: { type: String },
  ROUTE: { type: String },
  OTP: { type: Number },
  STAT: { type: String },
  ROOM_ID: { type: String },
  date: { type: Date },
  DRIVER_ID: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);

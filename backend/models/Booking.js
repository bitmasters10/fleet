const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  booking_reference: { type: String, required: true, unique: true },
  location: String,
  travel_date: Date,
  lead_traveler_name: String,
  hotel_pickup: String,
  status: String,
  start_datetime: Date,
  end_datetime: Date,
  book_status: { type: String, default: 'not booked' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);

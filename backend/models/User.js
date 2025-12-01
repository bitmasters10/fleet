const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  mobile_no: { type: String },
  name: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  aid: { type: String, required: true, unique: true },
  aname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);

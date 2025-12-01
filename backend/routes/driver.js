const express = require("express");
const Router = express.Router();
const { v4: uuidv4 } = require("uuid");
require('../mongo');
const Driver = require('../models/Driver');
const BookingEntry = require('../models/BookingEntry');

function isAdmin(req, res, next) {
  // console.log("Session:", req.session); // Log session data
  // console.log("User:", req.user); // Log the user object

  // if (!req.isAuthenticated() || !req.user) {
  //   console.log("User is not authenticated");
  //   return res.status(401).json({ message: "Unauthorized access." });
  // }

  // if (req.user.role !== "admin") {
  //   console.log("User role is not admin:", req.user.role);
  //   return res
  //     .status(403)
  //     .json({ message: "Forbidden: You are not a superadmin." });
  // }

  // console.log("Role verified:", req.user.role);
  return next(); // Proceed if authenticated and role is superadmin
}

async function idmake(table, column) {
  let id = uuidv4();
  // ensure uniqueness against Driver.DRIVER_ID
  const exists = await Driver.findOne({ DRIVER_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

Router.get('/drivers', isAdmin, async (req, res) => {
  try {
    const rows = await Driver.find({}, 'DRIVER_ID NAME EMAIL_ID LICENSE_NO GENDER').lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});
Router.get('/driver/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await Driver.findOne({ DRIVER_ID: id }).lean();
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    return res.status(200).json(driver);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).send('Server Error');
  }
});
Router.delete('/driver/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Driver.findOneAndDelete({ DRIVER_ID: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Driver not found' });
    return res.status(200).json({ message: 'delete done', res: deleted });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).send('Server Error');
  }
});

Router.patch('/driver/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const { NAME, EMAIL_ID, LICENSE_NO } = req.body;
  Driver.findOneAndUpdate({ DRIVER_ID: id }, { NAME, EMAIL_ID, LICENSE_NO }, { new: true }).lean()
    .then(updated => {
      if (!updated) return res.status(404).json({ message: 'Driver not found' });
      return res.status(200).json({ message: 'update done', res: updated });
    })
    .catch(err => {
      console.error('Error updating user:', err);
      return res.status(500).send('Server Error');
    });
});
Router.post("/avail-drivers", isAdmin, async (req, res) => {
  const { date, start_time, end_time } = req.body;

  if (!date || !start_time || !end_time) {
    return res
      .status(400)
      .send("All parameters (date, start_time, end_time) are required.");
  }

  try {
    // Find bookings on the date that conflict with requested slot
    const conflicts = await BookingEntry.find({
      DATE: date,
      $or: [
        { TIMING: { $lt: start_time }, END_TIME: { $gt: end_time } },
        { TIMING: { $lt: end_time }, END_TIME: { $gt: start_time } },
        { TIMING: { $gte: start_time }, END_TIME: { $lte: end_time } }
      ]
    }).lean();

    const busyDriverIds = conflicts.map(c => c.DRIVER_ID).filter(Boolean);
    const available = await Driver.find({ DRIVER_ID: { $nin: busyDriverIds } }, 'DRIVER_ID NAME').lean();
    return res.status(200).json(available);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Unexpected Server Error');
  }
});
Router.post('/myloc',(req,res)=>{
  const {lat,long}=req.body
  const id = req.user && req.user.DRIVER_ID;
  if (!id) return res.status(401).json({ message: 'Unauthorized' });
  Driver.findOneAndUpdate({ DRIVER_ID: id }, { LATITUDE: lat, LONGITUDE: long }, { new: true }).lean()
    .then(rows => res.status(200).json(rows))
    .catch(err => {
      console.error('Error executing query:', err);
      return res.status(500).send('Server Error');
    });

})
module.exports = Router;

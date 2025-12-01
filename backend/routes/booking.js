const express = require("express");
const Router = express.Router();
const { v4: uuidv4 } = require("uuid");
require('../mongo');
const BookingEntry = require('../models/BookingEntry');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');

async function idmake(table, column) {
  let id = uuidv4();
  // ensure uniqueness against BookingEntry.BOOK_ID
  const exists = await BookingEntry.findOne({ BOOK_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

function isAdmin(req, res, next) {
  // console.log("Session:", req.session); // Log session data
  // console.log("User:", req.user); // Log the user object

  // if (!req.isAuthenticated() || !req.user) {
  //   console.log("User is not authenticated");
  //   return res.status(401).json({ message: "Unauthorized access." });
  // }

  // if (req.user.role !== "admin") {
  //   console.log("User role is not admin:", req.user.role);
  //   return res.status(403).json({ message: "Forbidden: You are not a admin." });
  // }

  // console.log("Role verified:", req.user.role);
  return next(); // Proceed if authenticated and role is superadmin
}

Router.get("/available-books", async (req, res) => {
  // This endpoint previously joined multiple SQL tables (`success2`, `orders`, `users`, `package`).
  // We attempt a best-effort translation: return package + user info for packages with waiting status.
  try {
    // Find packages (names) — this is an approximation; adapt if you have collections for `success2` and `orders`.
    const packages = await Package.find().lean();
    // Combine with user mobile numbers where possible — this will be empty if `orders`/`success2` collections don't exist.
    const results = packages.map(p => ({
      package_id: p.PID,
      PROD_ID: p.PROD_ID,
      PLACES: p.PLACES,
      DURATION: p.DURATION,
      NAME: p.NAME,
    }));
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

Router.get('/test', (req, res) => res.json({ ok: true }));
Router.post("/add-package", async (req, res) => {
  const { pid, name, places, duration } = req.body;
  const Id = await idmake("package", "aid");
  let newCar = {
    PID: Id,
    PROD_ID: pid,
    NAME: name,
    PLACES: places,
    DURATION: duration,
  };
  try {
    const pkg = await Package.create(newCar);
    return res.status(200).json({ message: 'package', results: pkg });
  } catch (err) {
    console.error("Error during registration:", err);
  }
});
const formatTime = (timeString) => {
  if (!timeString || typeof timeString !== "string" || !timeString.includes(":")) {
    throw new Error("Invalid Time Format");
  }

  let [time, modifier] = timeString.trim().split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes) || hours > 12 || minutes > 59) {
    throw new Error("Invalid Time Format");
  }

  // Convert 12-hour format to 24-hour format
  if (modifier) {
    modifier = modifier.toUpperCase();
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  } else if (hours > 12) {
    throw new Error("Invalid AM/PM Format");
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`; // HH:MM:SS
};

Router.post("/create-book", async (req, res) => {
  let ID = await idmake("booking", "BOOK_ID");
  const {
    START_TIME: startTime,
    END_TIME: endTime,
    DATE: date,
    PICKUP_LOC,
    CAR_ID,
    USER_ID,
    BOOK_NO,
    NO_OF_PASSENGER,
    PACKAGE_ID,
    DROP_LOC,
    AC_NONAC,
    VID,
    DRIVER_ID,
    mobile,
  } = req.body;
  console.log("Received req.body:", req.body);



 
  let formattedDate, formattedStartTime, formattedEndTime;
  try {
    // Format DATE
    formattedDate = new Date(date).toISOString().split("T")[0];

    // Convert startTime and endTime from 12-hour to 24-hour format
    formattedStartTime = formatTime(startTime);
    formattedEndTime = formatTime(endTime);

  } catch (error) {
    console.error("🚨 Error:", error.message);
    return res.status(400).json({ error: error.message });
  }

  // Check for overlapping bookings on the same date
  // Check for overlapping bookings using BookingEntry model
  try {
    const overlap = await BookingEntry.findOne({
      CAR_ID,
      DRIVER_ID,
      DATE: formattedDate,
      TIMING: { $lt: formattedEndTime },
      END_TIME: { $gt: formattedStartTime }
    }).lean();

    if (overlap) {
      return res.status(409).json({ error: 'Booking overlaps with an existing one for the same car/driver and date' });
    }

    const newBook = {
      BOOK_ID: ID,
      TIMING: formattedStartTime,
      PICKUP_LOC,
      CAR_ID,
      USER_ID,
      BOOK_NO,
      DATE: formattedDate,
      NO_OF_PASSENGER,
      PACKAGE_ID,
      DROP_LOC,
      AC_NONAC,
      stat: 'READY',
      END_TIME: formattedEndTime,
      VID,
      DRIVER_ID,
      mobile_no: mobile,
    };

    await BookingEntry.create(newBook);

    // Update fleet status in success2 if bookings collection exists — skip if not.
    if (VID) {
      // attempt to update Booking (bookings collection) if BR is provided elsewhere; keeping as-is
    }

    return res.status(200).json({ message: 'Booking created successfully', bookingId: ID });
  } catch (err) {
    console.error('Error creating booking:', err);
    return res.status(500).send('Server Error');
  }
});


Router.post("/create-manual-book", async (req, res) => {
  let ID = await idmake("booking", "BOOK_ID");
  const {
    START_TIME,
    PICKUP_LOC,
    CAR_ID,
    USER_ID,
    BOOK_NO,
    DATE,
    NO_OF_PASSENGER,
    PACKAGE_ID,
    DROP_LOC,
    AC_NONAC,
    END_TIME,
    DRIVER_ID,
    MOBILE_NO,
  } = req.body;

  console.log("Creating a new booking...");

  // Check for overlapping bookings
  try {
    const overlap = await BookingEntry.findOne({
      CAR_ID,
      DRIVER_ID,
      DATE,
      $or: [
        { TIMING: { $lt: END_TIME }, END_TIME: { $gt: START_TIME } },
        { TIMING: { $lt: END_TIME }, END_TIME: { $gt: START_TIME } },
        { TIMING: { $gte: START_TIME }, END_TIME: { $lte: END_TIME } }
      ]
    }).lean();

    if (overlap) return res.status(409).json({ error: 'Booking already exists for the specified time and car/driver' });

    const newBook = {
      BOOK_ID: ID,
      TIMING: START_TIME,
      PICKUP_LOC,
      CAR_ID,
      USER_ID,
      BOOK_NO,
      DATE,
      NO_OF_PASSENGER,
      PACKAGE_ID,
      DROP_LOC,
      AC_NONAC,
      stat: 'READY',
      END_TIME,
      mobile_no: MOBILE_NO,
      DRIVER_ID,
    };

    const created = await BookingEntry.create(newBook);
    return res.status(200).json({ message: 'New booking added', results: created });
  } catch (err) {
    console.error('Error creating manual booking:', err);
    return res.status(500).send('Server Error');
  }
});
Router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const rows = await BookingEntry.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});

Router.patch('/booking/:id', async (req, res) => {
  try {
    const { BOOK_ID, TIMING, PICKUP_LOC, END_TIME } = req.body;
    const id = BOOK_ID;
    const updated = await BookingEntry.findOneAndUpdate({ BOOK_ID: id }, { TIMING, END_TIME, PICKUP_LOC }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Booking not found' });
    return res.status(200).json({ message: 'new book added', results: updated });
  } catch (err) {
    console.error('Error updating booking:', err);
    return res.status(500).send('Server Error');
  }
});

// duplicate /bookings route removed (already defined above)
Router.delete('/booking/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Remove any trip associated with this booking
    const trip = await require('../models/Trip').findOneAndDelete({ BOOK_ID: id }).lean();
    const deleted = await BookingEntry.findOneAndDelete({ BOOK_ID: id }).lean();
    if (!deleted) return res.status(404).json({ message: 'Booking not found' });
    const message = trip ? 'Booking and associated trip deleted successfully' : 'Booking deleted successfully';
    return res.status(200).json({ message });
  } catch (err) {
    console.error('Error during deletion:', err);
    return res.status(500).send('Server Error');
  }
});
Router.get('/packages', async (req, res) => {
  try {
    const rows = await Package.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve packages:', err);
    return res.status(500).send('Server Error');
  }
});
Router.post('/create-adv-book', async (req, res) => {
  console.log('REQ CAME FOR ADV');
  try {
    let ID = await idmake('booking', 'BOOK_ID');
    const {
      BR,
      START_TIME,
      PICKUP_LOC,
      CAR_ID,
      USER_ID,
      BOOK_NO,
      DATE,
      NO_OF_PASSENGER,
      PACKAGE_ID,
      DROP_LOC,
      AC_NONAC,
      END_TIME,
      DRIVER_ID,
      MOBILE_NO,
    } = req.body;

    // Validate required fields
    if (!START_TIME || !END_TIME || !DATE || !CAR_ID || !DRIVER_ID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for overlapping bookings using BookingEntry model
    const overlap = await BookingEntry.findOne({
      CAR_ID,
      DRIVER_ID,
      DATE,
      $or: [
        { TIMING: { $lt: END_TIME }, END_TIME: { $gt: START_TIME } },
        { TIMING: { $lt: END_TIME }, END_TIME: { $gt: START_TIME } },
        { TIMING: { $gte: START_TIME }, END_TIME: { $lte: END_TIME } }
      ]
    }).lean();

    if (overlap) {
      return res.status(409).json({ error: 'Booking already exists for the specified time and car/driver' });
    }

    // New booking object
    const newBook = {
      BOOK_ID: ID,
      TIMING: START_TIME,
      PICKUP_LOC,
      CAR_ID,
      USER_ID,
      BOOK_NO,
      DATE,
      NO_OF_PASSENGER,
      PACKAGE_ID,
      DROP_LOC,
      AC_NONAC,
      stat: 'READY',
      END_TIME,
      mobile_no: MOBILE_NO,
      DRIVER_ID,
      br: BR,
    };

    console.log('New Booking:', newBook);

    const created = await BookingEntry.create(newBook);

    // Update bookings collection (if the Booking model has the referenced booking_reference)
    if (BR) {
      const updated = await Booking.findOneAndUpdate({ booking_reference: BR }, { book_status: 'done' }, { new: true }).lean();
      if (updated) {
        return res.status(200).json({ message: 'New booking added and bookings table updated successfully', booking_id: ID });
      } else {
        return res.status(200).json({ message: 'New booking added (but no matching booking_reference found)', booking_id: ID });
      }
    }

    return res.status(200).json({ message: 'New booking added', booking_id: ID, booking: created });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = Router;


const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 3000;
dotenv.config();
const mysql2 = require('mysql2/promise');
const db = require("./db");


const app = express();
const home = "http://192.168.1.243:5500"
const clg = "http://172.16.255.151:5500"
// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      home, 
      "http://localhost:5500",  // Ensure this is included for your frontend
    ],
    credentials: true, 
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

const sessionStore = new MySQLStore({}, db.promise());

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000, // Session expires after 1 hour
  },
  store: sessionStore,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/driver-auth", require("./auth/driver"));
app.use("/admin-auth", require("./auth/admin"));
app.use("/Sadmin-auth", require("./auth/superadmin"));
app.use("/Sadmin", require("./routes/admin"));
app.use("/admin", require("./routes/car"));
app.use("/admin", require("./routes/booking"));
app.use("/admin", require("./routes/driver"));
app.use("/admin", require("./routes/trip"));
app.use("/admin", require("./routes/fuel"));
app.use("/driver", require("./routes/driver_app"));
app.use("/admin/img", require("./routes/img"));
app.use("/admin", require("./routes/user"));
app.use("/admin/maintenance", require("./routes/maintaince"));
app.use("/admin/insurance", require("./routes/insurance"));
app.use("/car-health", require("./routes/car_health"));
app.use("/admin", require("./routes/advisor"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const pool = mysql2.createPool({
  host: 'localhost',     // Replace with your host
  user: 'root',          // Replace with your username
 password: '',  // Replace with your password
 database: 'u820563802_Linda_fleet',
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0,
 connectTimeout: 10000,
});


const handleConfirmedBooking = async (eventDetails) => {
  const connection = await pool.getConnection();
  try {
    const {
      BookingReference,
      Location,
      TravelDate,
      LeadTravelerName,
      HotelPickup,
      Status,
      StartDateTime,
      EndDateTime,
    } = eventDetails;

    // Ensure status is "confirmed"
    if (Status !== "confirmed") {
      console.log("Status is not confirmed, skipping insertion.");
      return { message: "Booking is not confirmed." };
    }

    // Check if the booking already exists
    const [existingRows] = await  connection.query(
      "SELECT 1 FROM bookings WHERE booking_reference = ?",
      [BookingReference]
    );

    if (existingRows.length > 0) {
      console.log("Booking already exists, skipping insertion.");
      return { message: "Booking already exists." };
    }

    // Insert new booking with "not booked" status
    await  connection.query(
      `INSERT INTO bookings 
      (booking_reference, location, travel_date, lead_traveler_name, hotel_pickup, status, start_datetime, end_datetime, book_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        BookingReference,
        Location,
        TravelDate,
        LeadTravelerName,
        HotelPickup,
        Status,
        StartDateTime || null,
        EndDateTime || null,
        "not booked",
      ]
    );

    console.log("New booking inserted successfully.");
    connection.release();
    return { message: "Booking inserted successfully." };
    
  } catch (error) {
    console.error("Error inserting booking:", error);
    return { message: "Error processing booking." };
  }
};
const handleCancelledBooking = async (eventDetails) => {
  const connection = await pool.getConnection();
  try {
    const { BookingReference, Status } = eventDetails;

    // Ensure status is "Cancelled"
    if (Status !== "Cancelled") {
      console.log("Status is not Cancelled, skipping.");
      return { message: "Booking is not Cancelled." };
    }

    // Check if the booking exists in BOOKINGS
    const [existingRows] = await  connection.query(
      "SELECT status, book_status FROM bookings WHERE booking_reference = ?",
      [BookingReference]
    );

    if (existingRows.length === 0) {
      console.log("No existing booking found, skipping.");
      return { message: "No booking found with this reference." };
    }

    const { status: currentStatus, book_status } = existingRows[0];

    // If already cancelled, do nothing
    if (currentStatus === "Cancelled") {
      console.log("Booking is already Cancelled, skipping.");
      return { message: "Booking is already Cancelled." };
    }

    // If book_status is "done", delete from BOOKING first
    if (book_status === "done") {
      await  connection.query("DELETE FROM booking WHERE booking_reference = ?", [
        BookingReference,
      ]);
      console.log("Deleted from BOOKING table.");
    }

    // Update the status to Cancelled
    await  connection.query(
      "UPDATE bookings SET status = 'Cancelled' WHERE booking_reference = ?",
      [BookingReference]
    );

    console.log("Booking status updated to Cancelled.");
    connection.release();
    return { message: "Booking status updated to Cancelled." };
  } catch (error) {
    console.error("Error processing cancelled booking:", error);
    return { message: "Error processing booking cancellation." };
  }
};
const handleAmendedBooking = async (eventDetails) => {
  const connection = await pool.getConnection();
  try {
    const { 
      BookingReference, 
      Title, 
      Location, 
      TravelDate, 
      LeadTravelerName, 
      HotelPickup, 
      Status 
    } = eventDetails;

    // Ensure status is "Amended"
    if (Status !== "Amended") {
      console.log("Status is not Amended, skipping.");
      return { message: "Booking is not Amended." };
    }

    // Check if the booking exists and is not Cancelled
    const [existingRows] = await  connection.query(
      "SELECT book_status FROM bookings WHERE booking_reference = ? AND status != 'Cancelled'",
      [BookingReference]
    );

    if (existingRows.length === 0) {
      console.log("No valid booking found for amendment.");
      return { message: "No active booking found with this reference." };
    }

    const { book_status } = existingRows[0];

    // Update the BOOKINGS table (except StartDateTime and EndDateTime)
    await  connection.query(
      `UPDATE bookings 
       SET title = ?, location = ?, travel_date = ?, lead_traveler_name = ?, 
           hotel_pickup = ?, status = 'Amended' 
       WHERE booking_reference = ? AND status != 'Cancelled'`,
      [Title, Location, TravelDate, LeadTravelerName, HotelPickup, BookingReference]
    );

    console.log("Booking details updated to Amended.");

    // If book_status is "done", update the pickup location in BOOKING
    if (book_status === "done") {
      await  connection.query(
        "UPDATE booking SET PICKUP_LOC = ? WHERE br = ?",
        [HotelPickup, BookingReference]
      );
      console.log("Pickup location updated in BOOKING table.");
    }
    connection.release();

    return { message: "Booking successfully amended." };
  } catch (error) {
    console.error("Error processing amended booking:", error);
    return { message: "Error processing booking amendment." };
  }
};


app.post("/api/events", async (req, res) => {
  const eventDetails = req.body;

  if (!eventDetails || Object.keys(eventDetails).length === 0) {
    return res.status(400).json({ message: "Invalid request. No data received." });
  }

  try {
    let result;
    switch (eventDetails.Status) {
      case "confirmed":
        result = await handleConfirmedBooking(eventDetails);
        break;
      case "Cancelled":
        result = await handleCancelledBooking(eventDetails);
        break;
        case "Amended":
        result = await handleAmendedBooking(eventDetails);
        break;
      default:
        result = { message: "Unsupported booking status." };
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing event:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

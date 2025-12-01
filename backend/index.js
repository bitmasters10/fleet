
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 3000;
dotenv.config();
require('./mongo');
const Booking = require('./models/Booking');


const app = express();
const home = "http://192.168.1.243:5500"
const clg = "http://172.16.255.151:5500"
// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      home, 
      "http://localhost:5500",
       "http://localhost/usersite/views/dashboard.php",
       "http://localhost/usersite" 
      
      //   // Ensure this is included for your frontend
    ],
    credentials: true, 
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fleet',
  collectionName: 'sessions'
});

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
app.use("/user", require("./routes/userWeb"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


const handleConfirmedBooking = async (eventDetails) => {
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

    if (Status !== 'confirmed') return { message: 'Booking is not confirmed.' };

    const existing = await Booking.findOne({ booking_reference: BookingReference }).lean();
    if (existing) return { message: 'Booking already exists.' };

    await Booking.create({
      booking_reference: BookingReference,
      location: Location,
      travel_date: TravelDate ? new Date(TravelDate) : null,
      lead_traveler_name: LeadTravelerName,
      hotel_pickup: HotelPickup,
      status: Status,
      start_datetime: StartDateTime ? new Date(StartDateTime) : null,
      end_datetime: EndDateTime ? new Date(EndDateTime) : null,
      book_status: 'not booked',
    });

    return { message: 'Booking inserted successfully.' };
  } catch (error) {
    console.error('Error inserting booking:', error);
    return { message: 'Error processing booking.' };
  }
};

const handleCancelledBooking = async (eventDetails) => {
  try {
    const { BookingReference, Status } = eventDetails;
    if (Status !== 'Cancelled') return { message: 'Booking is not Cancelled.' };

    const booking = await Booking.findOne({ booking_reference: BookingReference });
    if (!booking) return { message: 'No booking found with this reference.' };

    if (booking.status === 'Cancelled') return { message: 'Booking is already Cancelled.' };

    // If book_status is 'done' there might be related booking records elsewhere; log for now
    if (booking.book_status === 'done') {
      console.log('Related booking had book_status done — manual cleanup may be required.');
    }

    booking.status = 'Cancelled';
    await booking.save();
    return { message: 'Booking status updated to Cancelled.' };
  } catch (error) {
    console.error('Error processing cancelled booking:', error);
    return { message: 'Error processing booking cancellation.' };
  }
};

const handleAmendedBooking = async (eventDetails) => {
  try {
    const { BookingReference, Title, Location, TravelDate, LeadTravelerName, HotelPickup, Status } = eventDetails;
    if (Status !== 'Amended') return { message: 'Booking is not Amended.' };

    const booking = await Booking.findOne({ booking_reference: BookingReference });
    if (!booking || booking.status === 'Cancelled') return { message: 'No active booking found with this reference.' };

    booking.title = Title || booking.title;
    booking.location = Location || booking.location;
    booking.travel_date = TravelDate ? new Date(TravelDate) : booking.travel_date;
    booking.lead_traveler_name = LeadTravelerName || booking.lead_traveler_name;
    booking.hotel_pickup = HotelPickup || booking.hotel_pickup;
    booking.status = 'Amended';
    await booking.save();

    if (booking.book_status === 'done') {
      console.log('Booking is done — if a separate booking record exists, update PICKUP_LOC manually.');
    }

    return { message: 'Booking successfully amended.' };
  } catch (error) {
    console.error('Error processing amended booking:', error);
    return { message: 'Error processing booking amendment.' };
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

app.get("/",(req,res)=>{
res.send("helo")
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

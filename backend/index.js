
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

const db = require("./db");


const app = express();
const home = "http://192.168.0.202:5500"
const clg = "http://172.16.239.81:5500"
// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", `${home}`], // Allowed origins
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
app.use("/admin/car-health", require("./routes/car_health"));



app.post("/api/events", (req, res) => {
  const eventDetails = req.body;

  if (!eventDetails || Object.keys(eventDetails).length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid request. No data received." });
  }


  const normalizedDetails = Object.entries(eventDetails).reduce(
    (acc, [key, value]) => {
      const newKey = key.replace(/[:\s]/g, ""); // Remove colons and spaces
      acc[newKey] = value;
      return acc;
    },
    {}
  );
  console.log("helo");
  console.log("Normalized Event Details:", normalizedDetails);

  // Process the normalizedDetails here (e.g., save to database)

  res
    .status(200)
    .json({ message: "Event received successfully", event: normalizedDetails });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

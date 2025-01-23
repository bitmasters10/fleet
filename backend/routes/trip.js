const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

async function idmake(table, column) {
  let id = uuidv4();

  const query = `SELECT * FROM ${table} WHERE ${column} = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      } 

      if (rows.length === 0) {
        return resolve(id);
      } else {
        idmake(table, column).then(resolve).catch(reject);
      }
    });
  });
}

function isAdmin(req, res, next) {
  console.log("Session:", req.session); // Log session data
  console.log("User:", req.user); // Log the user object

  if (!req.isAuthenticated() || !req.user) {
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    console.log("User role is not admin:", req.user.role);
    return res.status(403).json({ message: "Forbidden: You are not a admin." });
  }

  console.log("Role verified:", req.user.role);
  return next(); // Proceed if authenticated and role is superadmin
}


Router.post("/create-trip", async (req, res) => {
  let ID = await idmake("TRIP", "TRIP_ID");
  const {
    
  
    BOOK_NO,
   
   
    BOOK_ID,
    ROUTE
    
  } = req.body;
  var otp = Math.floor(1000 + Math.random() * 9000);
  
  const START_TIME=Date().getHours()+""+Date().getMinutes()
  const trip={
START_TIME:START_TIME,
TRIP_ID:ID,
BOOK_ID:BOOK_ID,
BOOK_NO:BOOK_NO,
ROUTE:ROUTE,
OTP:otp,
STAT:"JUST",
ROOM_ID:BOOK_ID
  }
  
  
});

Router.get("/bookings", (req, res) => {
  try {
    db.query("SELECT * FROM BOOKING ", (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.error("Error during retive:", err);
  }
});

Router.patch("/booking/:id", (req, res) => {
  const { id } = req.params;
  const {
    TIMING,
    
    END_TIME,
   
  } = req.body;
  const query = "UPDATE BOOKING SET   TIMING=?, END_TIME=?	WHERE BOOK_ID = ?";
  db.query(query, [TIMING, END_TIME, id], (err, rows) => {
    if (err) {
      console.error("Error updating user:", err);

      return res.status(500).send("Server Error");
    }
    return res.status(200).json({ message: "new book added", results: rows });
  });
});


module.exports = Router;

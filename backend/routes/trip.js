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
  try {
    let ID = await idmake("trip", "TRIP_ID");
    const { BOOK_NO, BOOK_ID, ROUTE, date } = req.body;
    const id = req.user.DRIVER_ID;
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random OTP
    const START_TIME = new Date().getHours() + "" + new Date().getMinutes(); // Get current time

    // Trip object to insert
    const trip = {
      START_TIME,
      TRIP_ID: ID,
      BOOK_ID,
      BOOK_NO,
      ROUTE,
      OTP: otp,
      STAT: "JUST",
      ROOM_ID: BOOK_ID,
      date,
      DRIVER_ID: id,
    };

    // Update the BOOKING table
    const updateBookingQuery = "UPDATE booking SET stat = ? WHERE BOOK_ID = ?";
    db.query(updateBookingQuery, ["TRIP", BOOK_ID], (err) => {
      if (err) {
        console.error("Error updating BOOKING:", err);
        return res.status(500).json({ error: "Database update failed" });
      }

      // Insert into TRIP table
      const insertTripQuery = "INSERT INTO trip SET ?";
      db.query(insertTripQuery, trip, (err) => {
        if (err) {
          console.error("Error inserting into TRIP:", err);
          return res.status(500).json({ error: "Database insertion failed" });
        }

        // Retrieve the newly created trip record
        const selectTripQuery = "SELECT * FROM trip WHERE TRIP_ID = ?";
        db.query(selectTripQuery, [ID], (err, results) => {
          if (err) {
            console.error("Error retrieving trip record:", err);
            return res.status(500).json({ error: "Failed to retrieve trip record" });
          }

          // Send the created trip record back to the client
          return res.status(201).json({ message: "Trip created successfully", trip: results[0] });
        });
      });
    });
  } catch (error) {
    console.error("Error in trip creation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
 
Router.get("/trips", isAdmin, (req, res) => {
  try {
    db.query("SELECT * FROM trip ", (err, rows) => {
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


Router.get("/location",(req,res)=>{
  function formatDate() {
    date=new Date();
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
  
    return `${year}-${month}-${day}`;
  }
  
  const currentDate = formatDate()
const q="select ROOM_ID FROM trip where date=?"
try {
  db.query(q,[currentDate], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server Error");
    }
    return res.status(200).json(rows);
  });
} catch (err) {
  console.error("Error during retive:", err);
}
  
})
Router.get("/curr-trips", async (req, res) => {
  try {
  
      const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const query = `
          SELECT * FROM trip
       
          WHERE STAT IN ('JUST', 'ONGOING') 
          AND date = ?;
      `;

      db.query(query, [ todayDate], (err, results) => {
          if (err) {
              console.error("Error fetching trips:", err);
              return res.status(500).json({ error: "Internal Server Error" });
          }
          res.json(results);
      });
  } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = Router;

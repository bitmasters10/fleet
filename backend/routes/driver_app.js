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
function isDriver(req, res, next) {
  console.log("Session:", req.session); // Log session data
  console.log("User:", req.user); // Log the user object

  if (!req.isAuthenticated() || !req.user) {
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user. role !== 'driver') {
    console.log("User role is not driver:", req.user.role);
    return res
      .status(403)
      .json({ message: "Forbidden: You are not a helo"+req.user.role });
  }
  return next();
}
Router.get("/book/:date",isDriver, (req, res) => {
  const id = req.user.DRIVER_ID;
  const { date } = req.params;
  console.log("Driver ID:", id);
  console.log(id)

  const q = "SELECT * FROM BOOKING WHERE DATE = ? AND DRIVER_ID = ? and stat=?";

  db.query(q, [date, id, "READY"], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});
Router.patch("/trip-complete", isDriver, (req, res) => {
  const id = req.user.DRIVER_ID; // Get the driver's ID from the authenticated user
  const { BOOK_ID } = req.body;

  // Get the current date and time
  const now = new Date();

  // Format the time as HH:MM
  const hours = now.getHours(); // Get the current hour (0-23)
  const minutes = now.getMinutes();
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedTime = `${formattedHours}:${formattedMinutes}`;

  // Format the date as yyyy-mm-dd
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  console.log("Formatted Time (24-hour):", formattedTime);
  console.log("Formatted Date (yyyy-mm-dd):", formattedDate);

  // Update the TRIP table
  const q = "UPDATE TRIP SET STAT=?, END_TIME=?, date=? WHERE DRIVER_ID=? AND BOOK_ID=?";
  db.query(
    q,
    ["COMPLETED", formattedTime, formattedDate, id, BOOK_ID],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "No matching trip found" });
      }

      res.json({ message: "Trip marked as completed", results });
    }
  );
});
Router.post("/otp", isDriver, (req, res) => {
  const { otp, BOOK_ID } = req.body;
  const id = req.user?.DRIVER_ID; // Ensure DRIVER_ID exists

  if (!otp || !BOOK_ID || !id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("OTP verification attempt:", { otp, BOOK_ID, driverId: id });

  const query =
    "SELECT OTP FROM TRIP WHERE DRIVER_ID = ? AND OTP = ? AND BOOK_ID = ?";
  
  db.query(query, [id, otp, BOOK_ID], (err, results) => {
    if (err) {
      console.error("Database error during OTP check:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      console.warn("Invalid OTP attempt for BOOK_ID:", BOOK_ID, "Driver ID:", id);
      return res.status(404).json({ message: "Incorrect OTP" });
    }

    console.log("OTP Matched! Updating trip status to ONGOING...");

    const updateQuery =
      "UPDATE TRIP SET STAT = ? WHERE DRIVER_ID = ? AND BOOK_ID = ?";
    
    db.query(updateQuery, ["ONGOING", id, BOOK_ID], (err, updateResults) => {
      if (err) {
        console.error("Database error during trip update:", err);
        return res.status(500).json({ error: "Database update failed" });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(400).json({ error: "Trip status update failed" });
      }

      console.log("Trip status updated to ONGOING. Fetching updated trip...");

      const selectUpdatedQuery =
        "SELECT * FROM TRIP WHERE DRIVER_ID = ? AND BOOK_ID = ?";
      
      db.query(selectUpdatedQuery, [id, BOOK_ID], (err, updatedResults) => {
        if (err) {
          console.error("Database error while retrieving updated record:", err);
          return res.status(500).json({ error: "Failed to retrieve updated record" });
        }

        return res.status(200).json({ message: "OTP verified", record: updatedResults[0] });
      });
    });
  });
});



Router.get("/all/book", (req, res) => {
  console.log("Request body:", req.body);
console.log("Request user:", req.user);
console.log("req came ")

  const id = req.user.DRIVER_ID;
  const q = "select * from BOOKING where DRIVER_ID=? AND stat=? ";
  db.query(q, [id, "READY"], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});
Router.get("/cars", isDriver,async (req, res) => {
  try {
    db.query("SELECT * FROM CARS ", (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.error("Error during retrive:", err);
  }
});
Router.post("/create-trip", isDriver,async (req, res) => {
  try {
    let ID = await idmake("TRIP", "TRIP_ID");
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
    const updateBookingQuery = "UPDATE BOOKING SET stat = ? WHERE BOOK_ID = ?";
    db.query(updateBookingQuery, ["TRIP", BOOK_ID], (err) => {
      if (err) {
        console.error("Error updating BOOKING:", err);
        return res.status(500).json({ error: "Database update failed" });
      }

      // Insert into TRIP table
      const insertTripQuery = "INSERT INTO TRIP SET ?";
      db.query(insertTripQuery, trip, (err) => {
        if (err) {
          console.error("Error inserting into TRIP:", err);
          return res.status(500).json({ error: "Database insertion failed" });
        }

        // Retrieve the newly created trip record
        const selectTripQuery = "SELECT * FROM TRIP WHERE TRIP_ID = ?";
        db.query(selectTripQuery, [ID], (err, results) => {
          if (err) {
            console.error("Error retrieving trip record:", err);
            return res
              .status(500)
              .json({ error: "Failed to retrieve trip record" });
          }

          // Send the created trip record back to the client
          return res
            .status(201)
            .json({ message: "Trip created successfully", trip: results[0] });
        });
      });
    });
  } catch (error) {
    console.error("Error in trip creation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
Router.get("/test", (req, res) => {
  db.query("select otp from TRIP", (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});
Router.get("/history",isDriver, (req, res) => {
  const id = req.user.DRIVER_ID;
  console.log("helo req fro history ")
  console.log(id)
  if (!id) {
    res.status(505).json({ error: "driver not ready " });
  }
  const q = "select * from TRIP where DRIVER_ID=? AND stat=? ";
  db.query(q, [id, "COMPLETED"], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
console.log("res send")
console.log(results)
    res.json(results);
  });
});
Router.get("drive/fuel",isDriver,(req,res)=>{
  const id = req.user.DRIVER_ID;
  if (!id) {
    res.status(505).json({ error: "driver not ready " });
  }
  const q = "select * from FUEL_CONSUMPTION where DRIVER_ID=?  ";
  db.query(q, [id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
})
Router.post("/myloc",(req,res)=>{
  const {lat,long}=req.body
  const id=req.user.DRIVER_ID;
  const q="UPDATE DRIVER SET LATITUDE=?,LONGITUDE=? where DRIVER_ID=?"
  try {
    db.query(q,[lat,long,id], (err, rows) => {
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
// Router.post("/create-fuel", upload.single("photo"), async (req, res) => {
//   try {
//     // Generate a unique F_ID
//     const F_ID = await idmake("FUEL_CONSUMPTION", "F_ID");

//     const { CAR_ID,  DATE, COST } = req.body;
//     const DRIVER_ID=req.user.DRIVER_ID;

//     // Check if the photo file is uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: "Photo is required" });
//     }

//     // Convert the photo file to a buffer
//     const PHOTO = req.file.buffer;

//     // Create the fuel consumption record
//     const query =
//       "INSERT INTO FUEL_CONSUMPTION (F_ID, CAR_ID, DRIVER_ID, DATE, COST, PHOTO) VALUES (?, ?, ?, ?, ?, ?)";
//     const values = [F_ID, CAR_ID, DRIVER_ID, DATE, COST, PHOTO];

//     db.query(query, values, (err, results) => {
//       if (err) {
//         console.error("Error executing query:", err);
//         return res.status(500).json({ error: "Database insertion failed" });
//       }

//       // Respond with the created record's ID and status
//       return res.status(201).json({ message: "Fuel consumption record created", F_ID });
//     });
//   } catch (error) {
//     console.error("Error in /create-fuel:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });
Router.get("/fuels",(req,res)=>{
  try {
    db.query("SELECT * FROM FUEL_CONSUMPTION ", (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.error("Error during retrive:", err);
  }
})
Router.get("/curr-trips", async (req, res) => {
  try {
      const driverId = req.user.DRIVER_ID; // Extract the DRIVER_ID from the authenticated user
      const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const query = `
          SELECT * FROM trip 
          WHERE DRIVER_ID = ? 
          AND STAT IN ('JUST', 'ONGOING') 
          AND date = ?;
      `;

      db.query(query, [driverId, todayDate], (err, results) => {
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

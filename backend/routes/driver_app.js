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
      .json({ message: "Forbidden: You are not a superadmin." });
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
Router.patch("/trip-complete",isDriver, (req, res) => {
  const id = req.user.DRIVER_ID;
  const { BOOK_ID } = req.body;
  const q = "update TRIP set STAT=? where  DRIVER_ID=? AND BOOK_ID=?";
  db.query(q, ["COMPLETED", id, BOOK_ID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});
Router.post("/otp", isDriver,(req, res) => {
  const { otp, BOOK_ID } = req.body;
  const id = req.user.DRIVER_ID;

  const query =
    "SELECT otp FROM TRIP WHERE  DRIVER_ID = ? AND otp = ? AND BOOK_ID = ?";
  db.query(query, [date, id, otp, BOOK_ID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length > 0) {
      const updateQuery =
        "UPDATE TRIP SET STAT = ? WHERE   DRIVER_ID = ? AND BOOK_ID = ?";
      db.query(updateQuery, ["ONGOING", id, BOOK_ID], (err) => {
        if (err) {
          console.error("Error executing update query:", err);
          return res.status(500).json({ error: "Database update failed" });
        }

        const selectUpdatedQuery =
          "SELECT * FROM TRIP WHERE date = ? AND DRIVER_ID = ? AND BOOK_ID = ?";
        db.query(
          selectUpdatedQuery,
          [date, id, BOOK_ID],
          (err, updatedResults) => {
            if (err) {
              console.error("Error retrieving updated record:", err);
              return res
                .status(500)
                .json({ error: "Failed to retrieve updated record" });
            }

            return res
              .status(200)
              .json({ message: "It's same", record: updatedResults });
          }
        );
      });
    } else {
      return res.status(404).json({ message: "Not same" });
    }
  });
});

Router.get("/all/book", (req, res) => {
  console.log("Request body:", req.body);
console.log("Request user:", req.user);

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
  if (!id) {
    res.status(505).json({ error: "driver not ready " });
  }
  const q = "select * from TRIP where DRIVER_ID=? AND stat=? ";
  db.query(q, [id, "COMPLETED"], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

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

module.exports = Router;

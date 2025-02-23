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

Router.get("/available-books", (req, res) => {
  const q = `
    SELECT 
        o.user_id, 
        o.capacity, 
        o.datetime, 
        o.product_name, 
        p.PID AS package_id,
        s.id AS success_id,
        p.PLACES,
        p.DURATION,
        u.mobile_no
    FROM 
        success2 s
    JOIN 
        orders o ON REPLACE(s.order_id, 'order_id=', '') = o.order_id
    JOIN 
        users u ON o.user_id = u.id
    JOIN 
        PACKAGE p ON o.product_name = p.name
    WHERE 
        s.order_status = ? AND s.fleet_status = ?
`;

  try {
    db.query(q, ["order_status=Success", "waiting"], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.log(err);
  }
});

Router.get("/test", (req, res) => {
  const q = `
  SELECT order_id from success2 where fleet_status=? and order_status=? 
`;
  try {
    db.query(q, ["waiting", "order_status=Success"], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.log(err);
  }
});
Router.post("/add-package", async (req, res) => {
  const { pid, name, places, duration } = req.body;
  const Id = await idmake("fleetSuperAdmin", "aid");
  let newCar = {
    PID: Id,
    PROD_ID: pid,
    NAME: name,
    PLACES: places,
    DURATION: duration,
  };
  try {
    db.query("INSERT INTO PACKAGE SET ?", newCar, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json({ message: "package", results: rows });
    });
  } catch (err) {
    console.error("Error during registration:", err);
  }
});

Router.post("/create-book", async (req, res) => {
  let ID = await idmake("BOOKING", "BOOK_ID");
  const {
    START_TIME: startTime,
    PICKUP_LOC,
    CAR_ID,
    USER_ID,
    BOOK_NO,
    DATE: date,
    NO_OF_PASSENGER,
    PACKAGE_ID,
    DROP_LOC,
    AC_NONAC,
    END_TIME: endTime,
    VID,
    DRIVER_ID,
    mobile,
  } = req.body;

 
  let formattedDate, formattedStartTime, formattedEndTime;
  try {
    // Parse and format DATE
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid DATE');
    }
    formattedDate = dateObj.toISOString().split('T')[0];

    // Parse and format START_TIME
    const startTimeObj = new Date(startTime);
    if (isNaN(startTimeObj.getTime())) {
      throw new Error('Invalid START_TIME');
    }
    const startIsoTime = startTimeObj.toISOString().split('T')[1];
    formattedStartTime = startIsoTime.substring(0, 8); // Extracts 'HH:MM:SS'

    // Parse and format END_TIME
    const endTimeObj = new Date(endTime);
    if (isNaN(endTimeObj.getTime())) {
      throw new Error('Invalid END_TIME');
    }
    const endIsoTime = endTimeObj.toISOString().split('T')[1];
    formattedEndTime = endIsoTime.substring(0, 8); // Extracts 'HH:MM:SS'
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  // Check for overlapping bookings on the same date
  db.query(
    `SELECT * FROM BOOKING 
     WHERE CAR_ID = ? 
     AND DRIVER_ID = ? 
     AND DATE = ? 
     AND TIMING < ? 
     AND END_TIME > ?`,
    [CAR_ID, DRIVER_ID, formattedDate, formattedEndTime, formattedStartTime],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error");
      }
      if (rows.length > 0) {
        return res.status(409).json({
          error: "Booking overlaps with an existing one for the same car/driver and date",
        });
      }

      // Prepare new booking data with formatted date/time
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
        stat: "READY",
        END_TIME: formattedEndTime,
        VID,
        DRIVER_ID,
        mobile_no: mobile,
      };

      // Insert new booking
      db.query("INSERT INTO BOOKING SET ?", newBook, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server Error");
        }
        
        // Update fleet status
        db.query(
          "UPDATE success2 SET fleet_status = ? WHERE id = ?",
          ["done", VID],
          (err, updateResult) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Server Error");
            }
            return res.status(200).json({
              message: "Booking created successfully",
              bookingId: ID,
              results: updateResult
            });
          }
        );
      });
    }
  );
});
Router.post("/create-manual-book", async (req, res) => {
  let ID = await idmake("BOOKING", "BOOK_ID");
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
  db.query(
    `SELECT * FROM BOOKING 
     WHERE CAR_ID = ? 
       AND DRIVER_ID = ? 
       AND DATE = ? 
       AND (
         (TIMING < ? AND END_TIME > ?) OR  -- Overlapping condition
         (TIMING < ? AND END_TIME > ?) OR  -- Overlapping condition
         (TIMING >= ? AND END_TIME <= ?)   -- Existing booking is within new booking
       )`,
    [
      CAR_ID,
      DRIVER_ID,
      DATE,
      START_TIME,
      END_TIME,
      START_TIME,
      END_TIME,
      START_TIME,
      END_TIME,
    ],
    (err, rows) => {
      if (err) {
        console.error("Error checking for overlapping bookings:", err);
        return res.status(500).send("Server Error");
      }
      if (rows.length > 0) {
        return res.status(409).json({
          error: "Booking already exists for the specified time and car/driver",
        });
      }

      // Create a new booking
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
        stat: "READY",
        END_TIME,
        mobile_no: MOBILE_NO,
        DRIVER_ID,
      };

      console.log("New booking data:", newBook);

      // Insert the new booking into the database
      db.query("INSERT INTO BOOKING SET ?", newBook, (err, rows) => {
        if (err) {
          console.error("Error inserting booking:", err);
          return res.status(500).send("Server Error");
        }
        return res
          .status(200)
          .json({ message: "New booking added", results: rows });
      });
    }
  );
});
Router.get("/bookings", isAdmin, (req, res) => {
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
    PICKUP_LOC,

    END_TIME,
  } = req.body;
  const query = "UPDATE BOOKING SET   TIMING=?, END_TIME=?,PICKUP_LOC=?	WHERE BOOK_ID = ?";
  db.query(query, [TIMING, END_TIME,PICKUP_LOC, id], (err, rows) => {
    if (err) {
      console.error("Error updating user:", err);

      return res.status(500).send("Server Error");
    }
    return res.status(200).json({ message: "new book added", results: rows });
  });
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
    console.error("Error during retrive:", err);
  }
});
Router.delete("/booking/:id", (req, res) => {
  const { id } = req.params;

  // First, check if there is a corresponding row in the `trip` table
  const checkTripQuery = "SELECT * FROM trip WHERE BOOK_ID = ?";
  const deleteTripQuery = "DELETE FROM trip WHERE BOOK_ID = ?";
  const deleteBookingQuery = "DELETE FROM booking WHERE BOOK_ID = ?";

  try {
    // Check if there is a row in the `trip` table
    db.query(checkTripQuery, [id], (err, tripRows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }

      // If a row exists in the `trip` table, delete it
      if (tripRows.length > 0) {
        db.query(deleteTripQuery, [id], (err, result) => {
          if (err) {
            console.error("Error deleting from trip table:", err);
            return res.status(500).send("Server Error");
          }

          // After deleting from the `trip` table, delete from the `booking` table
          db.query(deleteBookingQuery, [id], (err, result) => {
            if (err) {
              console.error("Error deleting from booking table:", err);
              return res.status(500).send("Server Error");
            }
            return res.status(200).json({ message: "Booking and associated trip deleted successfully" });
          });
        });
      } else {
        // If no row exists in the `trip` table, just delete from the `booking` table
        db.query(deleteBookingQuery, [id], (err, result) => {
          if (err) {
            console.error("Error deleting from booking table:", err);
            return res.status(500).send("Server Error");
          }
          return res.status(200).json({ message: "Booking deleted successfully" });
        });
      }
    });
  } catch (err) {
    console.error("Error during deletion:", err);
    return res.status(500).send("Server Error");
  }
});
Router.get("/packages", (req, res) => {
  try {
    db.query("SELECT * FROM PACKAGE ", (err, rows) => {
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
Router.post("/create-adv-book", async (req, res) => {
  let ID = await idmake("BOOKING", "BOOK_ID");
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

  db.query(
    "SELECT * FROM BOOKING WHERE CAR_ID=? AND DRIVER_ID=? AND TIMING=? AND END_TIME=?",
    [CAR_ID, DRIVER_ID, START_TIME, END_TIME],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error");
      }
      if (rows.length > 0) {
        return res.status(409).json({
          error: "Booking already exists for the specified time and car/driver",
        });
      }

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
        stat: "READY",
        END_TIME,
        mobile_no: MOBILE_NO,
        DRIVER_ID,
        br: BR,
      };

      console.log(MOBILE_NO);
      console.log(newBook);
      console.log(ID);

      // Insert into BOOKING table
      db.query("INSERT INTO BOOKING SET ?", newBook, (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server Error");
        }

        // Update bookings table after successful insertion
        const updateQuery = "UPDATE bookings SET book_status=? WHERE booking_reference=?";
        db.query(updateQuery, ["done", BR], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Server Error");
          }

          // Check if the update was successful
          if (result.affectedRows > 0) {
            return res.status(200).json({
              message: "New book added and bookings table updated successfully",
              results: rows,
            });
          } else {
            return res.status(404).json({
              error: "No matching booking_reference found in bookings table",
            });
          }
        });
      });
    }
  );
});

module.exports = Router;

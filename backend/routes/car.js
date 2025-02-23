const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

function isAdmin(req, res, next) {
  // console.log("Session:", req.session); // Log session data
  // console.log("User:", req.user); // Log the user object

  // if (!req.isAuthenticated() || !req.user) {
  //   console.log("User is not authenticated");
  //   return res.status(401).json({ message: "Unauthorized access." });
  // }

  // if (req.user.role !== "admin") {
  //   console.log("User role is not superadmin:", req.user.role);
  //   return res
  //     .status(403)
  //     .json({ message: "Forbidden: You are not a superadmin." });
  // }

  // console.log("Role verified:", req.user.role);
  return next(); // Proceed if authenticated and role is superadmin
}

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

Router.post("/create-car", isAdmin, async (req, res) => {
  const {
    CAR_NO,
    COLOR,
    CAR_TYPE,
    MODEL_NAME,
    COMPANY_NAME,
    SEATING_CAPACITY,
  } = req.body;
  const Id = await idmake("fleetSuperAdmin", "aid");
  let newCar = {
    CAR_ID: Id,
    CAR_NO: CAR_NO,
    CAR_TYPE: CAR_TYPE,
    MODEL_NAME: MODEL_NAME,
    COLOR: COLOR,
    COMPANY_NAME: COMPANY_NAME,
    SEATING_CAPACITY: SEATING_CAPACITY,
  };
  try {
    db.query("INSERT INTO CARS SET ?", newCar, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json({ message: "new car added", results: rows });
    });
  } catch (err) {
    console.error("Error during registration:", err);
  }
});

Router.get("/cars", isAdmin, async (req, res) => {
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
Router.get("/car/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM CARS WHERE CAR_ID = ?;";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json(results);
  });
});
Router.delete("/car/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const query = "delete FROM CARS WHERE car_ID = ?;";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "delte doene", res: results });
  });
});

Router.patch("/car/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const {
    CAR_NO,
    COLOR,
    CAR_TYPE,
    MODEL_NAME,
    COMPANY_NAME,
    SEATING_CAPACITY,
    STATUS,
  } = req.body;
  const query =
    "UPDATE CARS SET 	CAR_NO=?,	CAR_TYPE=?	,MODEL_NAME= ?	,COLOR=?	,COMPANY_NAME=?	,SEATING_CAPACITY=?	,STATUS=?	WHERE CAR_ID = ?";
  db.query(
    query,
    [
      CAR_NO,
      COLOR,
      CAR_TYPE,
      MODEL_NAME,
      COMPANY_NAME,
      SEATING_CAPACITY,
      STATUS,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Server Error");
        return;
      }
      return res.status(200).json({ message: "update doene", res: results });
    }
  );
});
Router.patch("/car-status/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const { STATUS } = req.body;
  const query = "UPDATE CARS SET 	STATUS=?	WHERE CAR_ID = ?";
  db.query(query, [STATUS, id], (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "update doene", res: results });
  });
});
Router.post("/avail-cars", isAdmin, (req, res) => {
  const { date, start_time, end_time } = req.body;
  console.log(date, start_time, end_time);

  if (!date || !start_time || !end_time) {
    return res
      .status(400)
      .send("All parameters (date, start_time, end_time) are required.");
  }

  const q = `
    SELECT DISTINCT c.CAR_ID, 
                    c.MODEL_NAME, 
                    c.SEATING_CAPACITY 
    FROM CARS c 
    LEFT JOIN BOOKING b 
    ON c.CAR_ID = b.CAR_ID 
    AND b.DATE = ? 
    AND (
        (b.TIMING < ? AND b.END_TIME > ?) OR  
        (b.TIMING < ? AND b.END_TIME > ?) OR  
        (b.TIMING >= ? AND b.END_TIME <= ?)   
    )
    WHERE b.CAR_ID IS NULL 
    AND c.STATUS = 'ACTIVE';
  `;

  try {
    db.query(
      q,
      [date, start_time, end_time, start_time, end_time, start_time, end_time],
      (err, rows) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("Server Error");
        }
        return res.status(200).json(rows);
      }
    );
  } catch (err) {
    console.error("Error during retrieve:", err);
    return res.status(500).send("Unexpected Server Error");
  }
});

Router.patch("/repair/:id", (req, res) => {
  const { id } = req.params;
  const q = `update CARS set STATUS=? WHERE CAR_ID=? `;
  db.query(q, ["REPAIR", id], (err, results) => {
    if (err) {
      console.error("Error fetching :", err);
      res.status(500).send("Server Error");
      return;
    }
    return res
      .status(200)
      .json({ message: "SENT TO REPAIR doene", res: results });
  });
});
Router.patch("/work/:id", (req, res) => {
  const { id } = req.params;
  const q = `update CARS set STATUS=? WHERE CAR_ID=? `;
  db.query(q, ["ACTIVE", id], (err, results) => {
    if (err) {
      console.error("Error fetching :", err);
      res.status(500).send("Server Error");
      return;
    }
    return res
      .status(200)
      .json({ message: "SENT TO REPAIR doene", res: results });
  });
});
Router.get("/car-trip-stats", (req, res) => {
  const query = `
    SELECT 
        c.CAR_ID,
        c.MODEL_NAME,
        COUNT(t.TRIP_ID) AS completed_trips
    FROM 
        cars c
    LEFT JOIN 
        booking b ON c.CAR_ID = b.CAR_ID
    LEFT JOIN 
        trip t ON b.BOOK_ID = t.BOOK_ID AND t.STAT = 'COMPLETED'
    GROUP BY 
        c.CAR_ID, c.MODEL_NAME;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching car trip stats:", err);
      return res.status(500).send("Server Error");
    }

    return res.status(200).json(results);
  });
});
module.exports = Router;

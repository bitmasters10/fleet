const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

function isAdmin(req, res, next) {
  console.log("Session:", req.session); // Log session data
  console.log("User:", req.user); // Log the user object

  if (!req.isAuthenticated() || !req.user) {
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    console.log("User role is not admin:", req.user.role);
    return res
      .status(403)
      .json({ message: "Forbidden: You are not a superadmin." });
  }

  console.log("Role verified:", req.user.role);
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

Router.get("/drivers", isAdmin, async (req, res) => {
  try {
    db.query(
      "SELECT DRIVER_ID,NAME, EMAIL_ID, LICENSE_NO,GENDER FROM DRIVER ",
      (err, rows) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("Server Error");
        }
        return res.status(200).json(rows);
      }
    );
  } catch (err) {
    console.error("Error during retrive:", err);
  }
});
Router.get("/driver/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM DRIVER WHERE DRIVER_ID = ?;";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json(results);
  });
});
Router.delete("/driver/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const query = "delete FROM DRIVER WHERE DRIVER_ID = ?;";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "delte doene", res: results });
  });
});

Router.patch("/driver/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const { NAME, EMAIL_ID, LICENSE_NO } = req.body;
  const query =
    "UPDATE DRIVER SET NAME =?, EMAIL_ID=?, LICENSE_NO=?	WHERE DRIVER_ID = ?";
  db.query(query, [NAME, EMAIL_ID, LICENSE_NO, id], (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "update doene", res: results });
  });
});
Router.post("/avail-drivers",isAdmin, (req, res) => {
  const { date, start_time, end_time } = req.body;

  if (!date || !start_time || !end_time) {
    return res
      .status(400)
      .send("All parameters (date, start_time, end_time) are required.");
  }

  const q = `
    SELECT c.DRIVER_ID,
    c.NAME
    FROM DRIVER c 
    LEFT JOIN BOOKING b 
    ON c.DRIVER_ID = b.DRIVER_ID 
    WHERE b.DRIVER_ID IS NULL 
    OR (
      b.DATE != ? 
      OR NOT (
        (? >= b.TIMING AND ? < b.END_TIME) OR 
        (? > b.TIMING AND ? <= b.END_TIME) OR 
        (? <= b.TIMING AND ? >= b.END_TIME)
      )
    )
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

Router.post("myloc",(req,res)=>{
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
module.exports = Router;

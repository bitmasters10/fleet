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
Router.get("/book/:id?:date", (req, res) => {
  
  const { id ,date} = req.params;

  console.log(id)

  const q = "SELECT OTP FROM TRIP WHERE DATE = ? AND BOOKING_ID = ? ";

  db.query(q, [date, id,], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});


module.exports = Router;

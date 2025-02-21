const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");


function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }
  return next();
}


async function idmake(table, column) {
  let id = uuidv4();
  const query = `SELECT * FROM ${table} WHERE ${column} = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, rows) => {
      if (err) return reject(err);
      if (rows.length === 0) return resolve(id);
      else idmake(table, column).then(resolve).catch(reject);
    });
  });
}


Router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { CAR_ID, RATING, MESSAGE, STATUS, LAST_MAINTENANCE, TIME_STAMP, DESCRIPTION } = req.body;

    // Fix: Ensure DESCRIPTION is checked properly
    if (!CAR_ID || !RATING || !MESSAGE || !STATUS || !LAST_MAINTENANCE || !TIME_STAMP || !DESCRIPTION) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const HEALTH_ID = await idmake("CAR_HEALTH", "HEALTH_ID");
    const DRIVER_ID = req.user.DRIVER_ID; 
    console.log(DRIVER_ID);
    const stat=STATUS;

    const query = `INSERT INTO CAR_HEALTH (HEALTH_ID, CAR_ID, RATING, DRIVER_ID, MESSAGE, STAT, LAST_MAINTENANCE, TIME_STAMP, DESCRIPTION) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [HEALTH_ID, CAR_ID, RATING, DRIVER_ID, MESSAGE, STATUS, LAST_MAINTENANCE, TIME_STAMP, DESCRIPTION], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Car health record added", HEALTH_ID });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



Router.get("/", isAuthenticated, (req, res) => {
  const query = "SELECT * FROM CAR_HEALTH";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
});


Router.get("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM CAR_HEALTH WHERE HEALTH_ID = ?";

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(results[0]);
  });
});


Router.put("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { RATING, MESSAGE, STATUS } = req.body;

  if (!RATING || !MESSAGE || !STATUS) {
    return res.status(400).json({ message: "Only RATING, MESSAGE, and STATUS can be updated." });
  }

  const query = "UPDATE CAR_HEALTH SET RATING = ?, MESSAGE = ?, STATUS = ? WHERE HEALTH_ID = ?";

  db.query(query, [RATING, MESSAGE, STATUS, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Car health record updated" });
  });
});


Router.delete("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM CAR_HEALTH WHERE HEALTH_ID = ?";

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Car health record deleted" });
  });
});

module.exports = Router;

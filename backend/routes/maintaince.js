const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You are not an admin." });
  }

  return next();
}

// Function to generate a unique ID
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


Router.post("/", isAdmin, async (req, res) => {
  try {
    const { CAR_ID, DATE, DESCRIPTION } = req.body;
    if (!CAR_ID || !DATE || !DESCRIPTION) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const M_ID = await idmake("MAINTENANCE", "M_ID");
    const query = "INSERT INTO MAINTENANCE (M_ID, CAR_ID, DATE, DESCRIPTION) VALUES (?, ?, ?, ?)";
    
    db.query(query, [M_ID, CAR_ID, DATE, DESCRIPTION], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Maintenance record added", M_ID });
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});


Router.get("/", isAdmin, (req, res) => {
  const query = "SELECT * FROM MAINTENANCE";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
});


Router.get("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM MAINTENANCE WHERE M_ID = ?";
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(results[0]);
  });
});


Router.put("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const { CAR_ID, DATE, DESCRIPTION } = req.body;

  if (!CAR_ID || !DATE || !DESCRIPTION) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "UPDATE MAINTENANCE SET CAR_ID = ?, DATE = ?, DESCRIPTION = ? WHERE M_ID = ?";
  
  db.query(query, [CAR_ID, DATE, DESCRIPTION, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Maintenance record updated" });
  });
});

Router.delete("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM MAINTENANCE WHERE M_ID = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Maintenance record deleted" });
  });
});

module.exports = Router;

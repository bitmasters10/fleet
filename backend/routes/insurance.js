const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");


function isAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You are not an admin." });
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


Router.post("/", isAdmin, async (req, res) => {
  try {
    const { CAR_ID, INSURANCE_NO, OTHER_DETAIL } = req.body;
    if (!CAR_ID || !INSURANCE_NO || !OTHER_DETAIL) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const IN_ID = await idmake("INSURANCE", "IN_ID");
    const query = "INSERT INTO INSURANCE (IN_ID, CAR_ID, INSURANCE_NO, OTHER_DETAIL) VALUES (?, ?, ?, ?)";
    
    db.query(query, [IN_ID, CAR_ID, INSURANCE_NO, OTHER_DETAIL], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Insurance record added", IN_ID });
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});


Router.get("/", isAdmin, (req, res) => {
  const query = "SELECT * FROM INSURANCE";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
});


Router.get("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM INSURANCE WHERE IN_ID = ?";
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(results[0]);
  });
});


Router.put("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const { CAR_ID, INSURANCE_NO, OTHER_DETAIL } = req.body;

  if (!CAR_ID || !INSURANCE_NO || !OTHER_DETAIL) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "UPDATE INSURANCE SET CAR_ID = ?, INSURANCE_NO = ?, OTHER_DETAIL = ? WHERE IN_ID = ?";
  
  db.query(query, [CAR_ID, INSURANCE_NO, OTHER_DETAIL, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Insurance record updated" });
  });
});


Router.delete("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM INSURANCE WHERE IN_ID = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Insurance record deleted" });
  });
});

module.exports = Router;

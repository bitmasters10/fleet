const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
const multer = require('multer');
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

const path = require("path"); 
const fs = require("fs");

// Multer setup for photo uploads
const storage = multer.memoryStorage(); // Store files in memory as a Buffer
const upload = multer({ storage });


Router.get("/fuel-records", async (req, res) => {
  const query = "SELECT * FROM FUEL";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

Router.post("/create-fuel", upload.single("photo"), async (req, res) => {
  try {
    // Generate a unique F_ID
    const F_ID = await idmake("FUEL_CONSUMPTION", "F_ID");

    const { CAR_ID, DRIVER_ID, DATE, COST } = req.body;

    // Check if the photo file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Photo is required" });
    }

    // Convert the photo file to a buffer
    const PHOTO = req.file.buffer;

    // Create the fuel consumption record
    const query =
      "INSERT INTO FUEL_CONSUMPTION (F_ID, CAR_ID, DRIVER_ID, DATE, COST, PHOTO) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [F_ID, CAR_ID, DRIVER_ID, DATE, COST, PHOTO];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database insertion failed" });
      }

      // Respond with the created record's ID and status
      return res.status(201).json({ message: "Fuel consumption record created", F_ID });
    });
  } catch (error) {
    console.error("Error in /create-fuel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
Router.patch("/accept/:id",(req,res)=>{
    const {id}=req.params
    const q="update FUEL_CONSUMPTION set stat=? where F_ID=?"
    db.query(q,["accepted",id], (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Database query failed" });
        }
    
        // Sending the results back to the client
        res.json(results);
      })
})
Router.patch("/reject/:id",(req,res)=>{
    const {id}=req.params
    const q="update FUEL_CONSUMPTION set stat=? where F_ID=?"
    db.query(q,["rejected",id], (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Database query failed" });
        }
    
        // Sending the results back to the client
        res.json(results);
      })
})
module.exports = Router;
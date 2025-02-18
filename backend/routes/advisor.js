const express = require("express");
const Router = express.Router();
const db = require("../db");
Router.get("/adv", async (req, res) => {
    try {
      const query = `
        SELECT B.*, P.PID, P.PROD_ID, P.PLACES, P.DURATION 
        FROM BOOKINGS B
        JOIN PACKAGE P ON B.title = P.NAME
        WHERE B.status != 'Cancelled' AND B.book_status != 'done'
      `;
  
      const [results] = await db.query(query);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching advanced booking data:", error);
      res.status(500).json({ message: "Error retrieving data" });
    }
  });
  module.exports = Router;
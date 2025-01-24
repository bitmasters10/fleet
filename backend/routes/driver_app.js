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
Router.get("/book/:date", (req, res) => {
  const id = req.user.DRIVER_ID; // Assuming req.user is populated via middleware
  const { date } = req.params; // Extracting date from params
  console.log("Driver ID:", id);

  const q = "SELECT * FROM BOOKING WHERE DATE = ? AND DRIVER_ID = ? and stat=?";

  db.query(q, [date, id,"READY"], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    // Sending the results back to the client
    res.json(results);
  });
});
Router.patch("/book-complete",(req,res)=>{
  const id = req.user.DRIVER_ID; // Assuming req.user is populated via middleware
  const { date , BOOK_ID} = req.body; // Extracting date from params
const q="update TRIP set STAT=? where date=? and DRIVER_ID=? AND BOOK_ID=?"
db.query(q,["COMPLETED",date,id,BOOK_ID], (err, results) => {
  if (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ error: "Database query failed" });
  }

  // Sending the results back to the client
  res.json(results);
})


})
Router.post("/otp", (req, res) => {
  const { otp, date, BOOK_ID } = req.body;
  const id = req.user.DRIVER_ID; // Assuming `req.user` contains `DRIVER_ID`

  const query = "SELECT otp FROM TRIP WHERE date = ? AND DRIVER_ID = ? AND otp = ? AND BOOK_ID = ?";
  db.query(query, [date, id, otp, BOOK_ID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    // Check if the query returned a matching result
    if (results.length > 0) {
      // If OTP matches, update the `STAT` column
      const updateQuery = "UPDATE TRIP SET STAT = ? WHERE date = ? AND DRIVER_ID = ? AND BOOK_ID = ?";
      db.query(updateQuery, ["ONGOING", date, id, BOOK_ID], (err) => {
        if (err) {
          console.error("Error executing update query:", err);
          return res.status(500).json({ error: "Database update failed" });
        }

        // After updating, retrieve the updated record
        const selectUpdatedQuery = "SELECT * FROM TRIP WHERE date = ? AND DRIVER_ID = ? AND BOOK_ID = ?";
        db.query(selectUpdatedQuery, [date, id, BOOK_ID], (err, updatedResults) => {
          if (err) {
            console.error("Error retrieving updated record:", err);
            return res.status(500).json({ error: "Failed to retrieve updated record" });
          }

          // Send the updated record back to the client
          return res.status(200).json({ message: "It's same", record: updatedResults });
        });
      });
    } else {
      // If OTP does not match
      return res.status(404).json({ message: "Not same" });
    }
  });
});


Router.get("/test",(req,res)=>{
  db.query("select otp from TRIP", (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    // Sending the results back to the client
    res.json(results);
  })
})

module.exports = Router;

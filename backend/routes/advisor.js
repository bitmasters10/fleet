const express = require("express");
const Router = express.Router();
const db = require("../db");
Router.get("/adv", async (req, res) => {
  try {
      // Step 1: Fetch data from the `bookings` table
      const bookingsQuery = `
          SELECT * 
          FROM bookings 
          WHERE status <> 'Cancelled' AND book_status <> 'done';
      `;

      db.query(bookingsQuery, async (err, bookingsResults) => {
          if (err) {
              console.error('Error fetching bookings:', err);
              return res.status(500).send('Server Error');
          }

          if (bookingsResults.length === 0) {
              return res.status(200).json({ res: [] }); // No bookings found
          }

          // Step 2: Trim the titles to remove \r and \n
          const trimmedBookingsResults = bookingsResults.map(booking => ({
              ...booking,
              title: booking.title.trim() // Trim whitespace and special characters
          }));

          // Extract the trimmed titles
          const titles = trimmedBookingsResults.map(booking => booking.title);

          // Step 3: Fetch data from the `PACKAGE` table based on the trimmed titles
          const packageQuery = `
              SELECT PID, PROD_ID, NAME, PLACES, DURATION 
              FROM PACKAGE 
              WHERE NAME IN (?);
          `;

          db.query(packageQuery, [titles], (err, packageResults) => {
              if (err) {
                  console.error('Error fetching packages:', err);
                  return res.status(500).send('Server Error');
              }

              // Combine the results
              const combinedResults = trimmedBookingsResults.map(booking => {
                  const package = packageResults.find(pkg => pkg.NAME === booking.title);
                  return {
                      booking_reference: booking.booking_reference,
                      title: booking.title,
                      location:booking.location,
                      hotel_pickup:booking.hotel_pickup,
                      start_datetime:booking.start_datetime,
                      PID: package ? package.PID : null,
                      PROD_ID: package ? package.PROD_ID : null,
                      PLACES: package ? package.PLACES : null,
                      DURATION: package ? package.DURATION : null
                  };
              });

              return res.status(200).json({ res: combinedResults });
          });
      });
  } catch (error) {
      console.error("Error fetching advanced booking data:", error);
      res.status(500).json({ message: "Error retrieving data" });
  }
});
  module.exports = Router;
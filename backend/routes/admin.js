const express = require('express');
const Router = express.Router();
const db = require('../db');
function isSuperAdmin(req, res, next) {
    console.log('Session:', req.session); // Log session data
    console.log('User:', req.user); // Log the user object

    if (!req.isAuthenticated() || !req.user) {
        console.log('User is not authenticated');
        return res.status(401).json({ message: "Unauthorized access." });
    }

    if (req.user.role !== 'superadmin') {
        console.log('User role is not superadmin:', req.user.role);
        return res.status(403).json({ message: "Forbidden: You are not a superadmin." });
    }

    console.log('Role verified:', req.user.role);
    return next(); // Proceed if authenticated and role is superadmin
}
Router.get("/admins",isSuperAdmin,async(req,res)=>{
    try{
        db.query('SELECT * FROM fleetAdmin ', (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                return  res.status(500).send('Server Error')

            }
            return res.status(200).json(rows)
        })

    }catch(err){
        console.error('Error during retive:', err);
    }
   
})

Router.get("/admin/:id",isSuperAdmin,async(req,res)=>{
    const { id } = req.params;
    const query = "SELECT * FROM fleetAdmin WHERE aid = ?;";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server Error');
            return;
        }
        return res.status(200).json(results)
    });
})
Router.delete("/admin/:id",isSuperAdmin,async(req,res)=>{
    const { id } = req.params;
    const query = "delete FROM fleetAdmin WHERE aid = ?;";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server Error');
            return;
        }
        return res.status(200).json({message:"delte doene",res:results})
    });
})

Router.patch('/admin/:id', isSuperAdmin,(req, res) => {
    const { id } = req.params;
    const { aname, email } = req.body;
    const query = 'UPDATE fleetAdmin SET aname = ?, email = ? WHERE aid = ?';
    db.query(query, [aname, email, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Server Error');
            return;
        }
        return res.status(200).json({message:"update doene",res:results})
    });
});
Router.patch("/admin/:id",isSuperAdmin,(req,res)=>{
    const {pass}=req.body
    const{id}=req.params
    const q="UPDATE fleetAdmin SET aname = ?, email = ? WHERE aid = ?"
})

Router.get("/monthly-report/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
  
      // Format month to ensure it's always two digits (e.g., "03" for March)
      const formattedMonth = month.padStart(2, "0");
  
      // Get first and last day of the given month
      const startDate = `${year}-${formattedMonth}-01`;
      const endDate = `${year}-${formattedMonth}-31`;
  
      // Query to get total fuel cost for the month
      const fuelCostQuery = `
        SELECT SUM(COST) AS total_fuel_cost
        FROM FUEL_CONSUMPTION
        WHERE DATE BETWEEN ? AND ?
      `;
  
      // Query to get fuel cost per vehicle
      const fuelPerVehicleQuery = `
        SELECT f.CAR_ID, c.CAR_NO, c.MODEL_NAME, SUM(f.COST) AS fuel_cost
        FROM FUEL_CONSUMPTION f
        JOIN CARS c ON f.CAR_ID = c.CAR_ID
        WHERE f.DATE BETWEEN ? AND ?
        GROUP BY f.CAR_ID
      `;
  
      // Query to count total bookings for the month
      const totalBookingsQuery = `
        SELECT COUNT(*) AS total_bookings
        FROM BOOKING
        WHERE DATE BETWEEN ? AND ?
      `;
  
      // Query to count total trips completed in the month
      const totalTripsQuery = `
        SELECT COUNT(*) AS total_trips
        FROM TRIP
        WHERE date BETWEEN ? AND ? AND STAT = 'COMPLETED'
      `;
  
      // Query to get trips per vehicle
      const tripsPerVehicleQuery = `
        SELECT b.CAR_ID, c.CAR_NO, c.MODEL_NAME, COUNT(t.TRIP_ID) AS trips_completed
        FROM TRIP t
        JOIN BOOKING b ON t.BOOK_ID = b.BOOK_ID
        JOIN CARS c ON b.CAR_ID = c.CAR_ID
        WHERE t.date BETWEEN ? AND ? AND t.STAT = 'COMPLETED'
        GROUP BY b.CAR_ID
      `;
  
      // Query to get trips per driver
      const tripsPerDriverQuery = `
        SELECT d.DRIVER_ID, d.NAME, COUNT(t.TRIP_ID) AS trips_completed, SUM(f.COST) AS total_fuel_cost
        FROM TRIP t
        JOIN DRIVER d ON t.DRIVER_ID = d.DRIVER_ID
        LEFT JOIN FUEL_CONSUMPTION f ON t.DRIVER_ID = f.DRIVER_ID AND f.DATE BETWEEN ? AND ?
        WHERE t.date BETWEEN ? AND ? AND t.STAT = 'COMPLETED'
        GROUP BY d.DRIVER_ID
      `;
  
      // Execute queries
      db.query(fuelCostQuery, [startDate, endDate], (err, fuelCostResult) => {
        if (err) {
          console.error("Fuel Cost Query Error:", err);
          return res.status(500).json({ error: "Database Error" });
        }
  
        db.query(fuelPerVehicleQuery, [startDate, endDate], (err, fuelPerVehicleResult) => {
          if (err) {
            console.error("Fuel Per Vehicle Query Error:", err);
            return res.status(500).json({ error: "Database Error" });
          }
  
          db.query(totalBookingsQuery, [startDate, endDate], (err, totalBookingsResult) => {
            if (err) {
              console.error("Total Bookings Query Error:", err);
              return res.status(500).json({ error: "Database Error" });
            }
  
            db.query(totalTripsQuery, [startDate, endDate], (err, totalTripsResult) => {
              if (err) {
                console.error("Total Trips Query Error:", err);
                return res.status(500).json({ error: "Database Error" });
              }
  
              db.query(tripsPerVehicleQuery, [startDate, endDate], (err, tripsPerVehicleResult) => {
                if (err) {
                  console.error("Trips Per Vehicle Query Error:", err);
                  return res.status(500).json({ error: "Database Error" });
                }
  
                db.query(
                  tripsPerDriverQuery,
                  [startDate, endDate, startDate, endDate],
                  (err, tripsPerDriverResult) => {
                    if (err) {
                      console.error("Trips Per Driver Query Error:", err);
                      return res.status(500).json({ error: "Database Error" });
                    }
  
                    // Send final report response
                    return res.status(200).json({
                      month: `${year}-${formattedMonth}`,
                      total_fuel_cost: fuelCostResult[0]?.total_fuel_cost || 0,
                      total_bookings: totalBookingsResult[0]?.total_bookings || 0,
                      total_trips: totalTripsResult[0]?.total_trips || 0,
                      fuel_per_vehicle: fuelPerVehicleResult,
                      trips_per_vehicle: tripsPerVehicleResult,
                      trips_per_driver: tripsPerDriverResult,
                    });
                  }
                );
              });
            });
          });
        });
      });
    } catch (error) {
      console.error("Unexpected Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  Router.post("/generate-pdf", (req, res) => {
    const { reportData } = req.body;
  
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();
  
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly-report-${reportData.month}.pdf`
    );
  
    doc.pipe(res);
  
    // Add title
    doc.fontSize(25).text(`Monthly Report: ${reportData.month}`, 100, 80);
  
    // Add key metrics
    doc.fontSize(14).text(`Total Fuel Cost: ₹${reportData.total_fuel_cost}`, 100, 150);
    doc.text(`Total Bookings: ${reportData.total_bookings}`, 100, 170);
    doc.text(`Total Trips: ${reportData.total_trips}`, 100, 190);
  
    // Add fuel cost per vehicle
    doc.moveDown();
    doc.fontSize(16).text("Fuel Cost Per Vehicle:", 100, 220);
    reportData.fuel_per_vehicle.forEach((vehicle, index) => {
      doc.text(
        `${vehicle.CAR_NO} (${vehicle.MODEL_NAME}): ₹${vehicle.fuel_cost}`,
        120,
        240 + index * 20
      );
    });
  
    // Add trips per vehicle
    doc.moveDown();
    doc.fontSize(16).text("Trips Per Vehicle:", 100, 340);
    reportData.trips_per_vehicle.forEach((vehicle, index) => {
      doc.text(
        `${vehicle.CAR_NO} (${vehicle.MODEL_NAME}): ${vehicle.trips_completed} trips`,
        120,
        360 + index * 20
      );
    });
  
    // Add trips per driver
    doc.moveDown();
    doc.fontSize(16).text("Trips Per Driver:", 100, 460);
    reportData.trips_per_driver.forEach((driver, index) => {
      doc.text(
        `${driver.NAME}: ${driver.trips_completed} trips (Fuel Cost: ₹${driver.total_fuel_cost})`,
        120,
        480 + index * 20
      );
    });
  
    doc.end();
  });
module.exports = Router;
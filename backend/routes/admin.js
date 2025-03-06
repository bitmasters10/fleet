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

  const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

  // Function to generate a bar chart
  async function generateBarChart(data, labels, title) {
    const width = 600;
    const height = 400;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
    const configuration = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    return image;
  }
  

  Router.post("/generate-pdf", async (req, res) => {
    const { reportData } = req.body;
    const PDFDocument = require("pdfkit");
    const fs = require("fs");
    const path = require("path");
    const doc = new PDFDocument({ margin: 50 });
  
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly-report-${reportData.month}.pdf`
    );
  
    doc.pipe(res);
  
    // **Add Logo**
    const logoPath = path.join(__dirname, "../assets/icon.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 100 });
    }
  
    // **Title - Bold**
    doc
      .fontSize(25)
      .font("Helvetica-Bold") // Bold font for the title
      .text(`Monthly Report: ${reportData.month}`, 200, 50)
      .moveDown(1);
  
    // **Key Metrics with Icons**
// **Key Metrics with Icons**
// **Key Metrics with Icons**
const fuelIconPath = path.join(__dirname, "../assets/fuel-icon.png");
const bookingIconPath = path.join(__dirname, "../assets/booking-icon.png");
const tripIconPath = path.join(__dirname, "../assets/trip-icon.png");

let y = 150; // Initial Y position

if (fs.existsSync(fuelIconPath)) {
  doc.image(fuelIconPath, 50, y - 2, { width: 20 }); // Adjust Y position for icon
}

// Calculate the width of the label
const label1 = "Total Fuel Cost: ";
const value1 = `${reportData.total_fuel_cost}`;
const labelWidth1 = doc.widthOfString(label1);

doc
  .fontSize(16)
  .font("Helvetica-Bold") // Bold font for the label
  .fillColor("#000") // Black color for the label
  .text(label1, 80, y); // Write the label

doc
  .font("Helvetica") // Lighter font for the value
  .fillColor("#666") // Lighter color for the value
  .text(value1, 80 + labelWidth1, y); // Write the value next to the label

y += 20; // Move Y position down for the next line

if (fs.existsSync(bookingIconPath)) {
  doc.image(bookingIconPath, 50, y - 2, { width: 20 }); // Adjust Y position for icon
}

// Calculate the width of the label
const label2 = "Total Bookings: ";
const value2 = `${"   " + reportData.total_bookings}`;
const labelWidth2 = doc.widthOfString(label2);

doc
  .font("Helvetica-Bold")
  .fillColor("#000") // Reset to black for the label
  .text(label2, 80, y); // Write the label

doc
  .font("Helvetica")
  .fillColor("#666") // Lighter color for the value
  .text(value2, 80 + labelWidth2, y); // Write the value next to the label

y += 20; // Move Y position down for the next line

if (fs.existsSync(tripIconPath)) {
  doc.image(tripIconPath, 50, y - 2, { width: 20 }); // Adjust Y position for icon
}

// Calculate the width of the label
const label3 = "Total Trips: ";
const value3 = `${" " + reportData.total_trips}`;
const labelWidth3 = doc.widthOfString(label3);

doc
  .font("Helvetica-Bold")
  .fillColor("#000") // Reset to black for the label
  .text(label3, 80, y); // Write the label

doc
  .font("Helvetica")
  .fillColor("#666") // Lighter color for the value
  .text(value3, 80 + labelWidth3, y); // Write the value next to the label
   k
    // **Fuel Cost Per Vehicle - Bar Chart**
    const fuelLabels = reportData.fuel_per_vehicle.map((v) => `${v.CAR_NO} (${v.MODEL_NAME})`);
    const fuelData = reportData.fuel_per_vehicle.map((v) => v.fuel_cost);
    const fuelChart = await generateBarChart(fuelData, fuelLabels, "Fuel Cost Per Vehicle");
  
    // Add the bar chart to the PDF
    doc.moveDown();
    doc.fontSize(16).font("Helvetica-Bold").text("Fuel Cost Per Vehicle", 50, doc.y);
    doc.moveDown(0.5);
    doc.image(fuelChart, 50, doc.y, { width: 500 });
    doc.moveDown();
  
    // **Fuel Cost Per Vehicle - List (No Icons)**
    doc.fontSize(16).font("Helvetica-Bold").text("Fuel Cost Per Vehicle (Details):", 50, doc.y + 450).moveDown(0.5);
    reportData.fuel_per_vehicle.forEach((vehicle, index) => {
      doc
        .font("Helvetica")
        .fillColor("#000")
        .text(`${vehicle.CAR_NO} (${vehicle.MODEL_NAME}): `, 70, doc.y + 20 + index * 20)
        .fillColor("#666")
        .text(`₹${vehicle.fuel_cost}`, { continued: true });
    });
  
    // **Trips Per Vehicle - Summary Cards**
   // **Trips Per Vehicle - Summary Cards**
doc.moveDown(2); // Add space before the section
doc.fontSize(20).font("Helvetica-Bold").text("Trips Per Vehicle", 10, doc.y + 50); // Section heading

reportData.trips_per_vehicle.forEach((vehicle, index) => {
  const y = doc.y + 20 + index * 80; // Adjust Y position for each card
  doc
    .rect(50, y, 500, 70) // Card outline
    .stroke();
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#000")
    .text(`Vehicle: ${vehicle.CAR_NO} (${vehicle.MODEL_NAME})`, 60, y + 10); // Vehicle details
  doc
    .font("Helvetica")
    .fillColor("#666")
    .text(`Trips Completed: ${vehicle.trips_completed}`, 60, y + 30); // Trips completed
});

// **Trips Per Driver - Summary Cards**
doc.moveDown(2); // Add space before the section
doc.fontSize(20).font("Helvetica-Bold").text("Trips Per Driver", 50, doc.y + 50); // Section heading

reportData.trips_per_driver.forEach((driver, index) => {
  const y = doc.y + 20 + index * 80; // Adjust Y position for each card
  doc
    .rect(50, y, 500, 70) // Card outline
    .stroke();
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#000")
    .text(`Driver: ${driver.NAME}`, 60, y + 10); // Driver details
  doc
    .font("Helvetica")
    .fillColor("#666")
    .text(`Trips Completed: ${driver.trips_completed}`, 60, y + 30); // Trips completed
  doc
    .text(`Fuel Cost: ₹${driver.total_fuel_cost}`, 60, y + 50); // Fuel cost
});
    doc.end();
  });
module.exports = Router;
const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
const multer = require('multer');

Router.get('/driver/:id/adharcard', (req, res) => {
    const driverId = req.params.id;

    db.query('SELECT ADHARCARD FROM DRIVER WHERE DRIVER_ID = ?', [driverId], (err, rows) => {
        if (err) {
            console.error('Error retrieving Aadhaar card:', err);
            return res.status(500).send('Error retrieving Aadhaar card');
        }

        if (rows.length > 0) {
            const fileData = rows[0].ADHARCARD;

            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename="adharcard.jpg"'
            });

            res.end(fileData);
        } else {
            res.status(404).send('Aadhaar card not found');
    }
});
});
Router.get('/driver/:id/pancard', (req, res) => {
    const driverId = req.params.id;

    db.query('SELECT PANCARD FROM DRIVER WHERE DRIVER_ID = ?', [driverId], (err, rows) => {
        if (err) {
            console.error('Error retrieving Aadhaar card:', err);
            return res.status(500).send('Error retrieving Aadhaar card');
        }

        if (rows.length > 0) {
            const fileData = rows[0].PANCARD;

            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename="pancard.jpg"'
            });

            res.end(fileData);
        } else {
            res.status(404).send('pan card not found');
    }
});
});
Router.get('/fuel/:id', (req, res) => {
    const Id = req.params.id;

    db.query('SELECT PHOTO FROM FUEL_CONSUMPTION WHERE F_ID = ?', [Id], (err, rows) => {
        if (err) {
            console.error('Error retrieving BILL ', err);
            return res.status(500).send('Error retrieving Aadhaar card');
        }

        if (rows.length > 0) {
            const fileData = rows[0].PHOTO;

            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename="BILL.jpg"'
            });

            res.end(fileData);
        } else {
            res.status(404).send('Aadhaar card not found');
    }
});
});
Router.get('/fuel-view/:id', (req, res) => {
    const Id = req.params.id;

    db.query('SELECT PHOTO FROM FUEL_CONSUMPTION WHERE F_ID = ?', [Id], (err, rows) => {
        if (err) {
            console.error('Error retrieving BILL ', err);
            return res.status(500).send('Error retrieving Aadhaar card');
        }

        if (rows.length > 0) {
            const fileData = rows[0].PHOTO;

           

            res.end(fileData);
        } else {
            res.status(404).send('bill card not found');
    }
});
});
Router.get('/driver-view/:id/adharcard', (req, res) => {
    const driverId = req.params.id;

    db.query('SELECT ADHARCARD FROM DRIVER WHERE DRIVER_ID = ?', [driverId], (err, rows) => {
        if (err) {
            console.error('Error retrieving Aadhaar card:', err);
            return res.status(500).send('Error retrieving Aadhaar card');
        }

        if (rows.length > 0) {
            const fileData = rows[0].ADHARCARD;

            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename="adharcard.jpg"'
            });

            res.end(fileData);
        } else {
            res.status(404).send('Aadhaar card not found');
    }
});
});
Router.get('/driver-view/:id/pancard', (req, res) => {
    const driverId = req.params.id;

    db.query('SELECT PANCARD FROM DRIVER WHERE DRIVER_ID = ?', [driverId], (err, rows) => {
        if (err) {
            console.error('Error retrieving Aadhaar card:', err);
            return res.status(500).send('Error retrieving Aadhaar card');
        }

        if (rows.length > 0) {
            const fileData = rows[0].PANCARD;

          

            res.end(fileData);
        } else {
            res.status(404).send('pan card not found');
    }
});
});
module.exports = Router;
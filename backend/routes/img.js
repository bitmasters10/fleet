const express = require('express');
const Router = express.Router();
require('../mongo');
const Driver = require('../models/Driver');
const FuelConsumption = require('../models/FuelConsumption');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

Router.get('/driver/:id/adharcard', async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await Driver.findOne({ DRIVER_ID: driverId }).lean();
        if (!driver || !driver.ADHARCARD) return res.status(404).send('Aadhaar card not found');
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="adharcard.jpg"'
        });
        res.end(driver.ADHARCARD);
    } catch (err) {
        console.error('Error retrieving Aadhaar card:', err);
        return res.status(500).send('Error retrieving Aadhaar card');
    }
});
Router.get('/driver/:id/pancard', async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await Driver.findOne({ DRIVER_ID: driverId }).lean();
        if (!driver || !driver.PANCARD) return res.status(404).send('PAN card not found');
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="pancard.jpg"'
        });
        res.end(driver.PANCARD);
    } catch (err) {
        console.error('Error retrieving PAN card:', err);
        return res.status(500).send('Error retrieving PAN card');
    }
});
Router.get('/fuel/:id', async (req, res) => {
    const Id = req.params.id;
    try {
        const f = await FuelConsumption.findOne({ F_ID: Id }).lean();
        if (!f || !f.PHOTO) return res.status(404).send('Bill not found');
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="BILL.jpg"'
        });
        res.end(f.PHOTO);
    } catch (err) {
        console.error('Error retrieving BILL ', err);
        return res.status(500).send('Error retrieving bill');
    }
});
Router.get('/fuel-view/:id', async (req, res) => {
    const Id = req.params.id;
    try {
        const f = await FuelConsumption.findOne({ F_ID: Id }).lean();
        if (!f || !f.PHOTO) {
            console.log('Fuel bill not found for ID:', Id);
            return res.status(404).send('Fuel bill not found');
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(f.PHOTO);
    } catch (err) {
        console.error('Error retrieving fuel bill:', err);
        return res.status(500).send('Error retrieving fuel bill');
    }
});

Router.get('/driver-view/:id/adharcard', async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await Driver.findOne({ DRIVER_ID: driverId }).lean();
        if (!driver || !driver.ADHARCARD) return res.status(404).send('Aadhaar card not found');
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(driver.ADHARCARD);
    } catch (err) {
        console.error('Error retrieving Aadhaar card:', err);
        return res.status(500).send('Error retrieving Aadhaar card');
    }
});

Router.get('/driver-view/:id/pancard', async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await Driver.findOne({ DRIVER_ID: driverId }).lean();
        if (!driver || !driver.PANCARD) return res.status(404).send('PAN card not found');
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(driver.PANCARD);
    } catch (err) {
        console.error('Error retrieving PAN card:', err);
        return res.status(500).send('Error retrieving PAN card');
    }
});

module.exports = Router;
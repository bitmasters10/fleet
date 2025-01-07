const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const port=3000;
dotenv.config();
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");
const { createServer } = require("http");
const db=require("./db")
const driver = require('./auth/driver'); 

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

<<<<<<< HEAD
app.use('/driver', require('./auth/driver'));
=======
app.post('/register', driver.upload, (req, res, next) => {
    passport.authenticate('local-register', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'An error occurred during registration.' });
        }

        if (!user) {
            // If registration fails, send a failure response
            return res.status(400).json({ success: false, message: info.message || 'Registration failed.' });
        }

        // Successful registration without logging in the user
        res.status(200).json({ success: true, message: 'Registration successful!', user });
    })(req, res, next); // Pass req, res, next to authenticate method
});
app.post('/api/events', (req, res) => {
    const eventDetails = req.body;

    if (!eventDetails || Object.keys(eventDetails).length === 0) {
        return res.status(400).json({ message: 'Invalid request. No data received.' });
    }

   
>>>>>>> b7eebda9d7e2fb0b0570e8aede3b62ddea72ab6e

    // Normalize keys by removing colons and spaces
    const normalizedDetails = Object.entries(eventDetails).reduce((acc, [key, value]) => {
        const newKey = key.replace(/[:\s]/g, ''); // Remove colons and spaces
        acc[newKey] = value;
        return acc;
    }, {});

    console.log("Normalized Event Details:", normalizedDetails);

    // Process the normalizedDetails here (e.g., save to database)

    res.status(200).json({ message: 'Event received successfully', event: normalizedDetails });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
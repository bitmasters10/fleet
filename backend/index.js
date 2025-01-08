/* eslint-disable no-unused-vars */
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
app.use(cors({
    origin: 'http://localhost:5173', // your frontend's URL
    credentials: true,  // Allows cookies to be sent
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const sessionStore = new MySQLStore({}, db.promise());

const sessionMiddleware = session({ 
    secret: 'your-secret-key', 
    resave: false, 
    saveUninitialized: false, 
    store: sessionStore 
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());


app.use('/driver-auth', require('./auth/driver'));
app.use('/admin-auth', require('./auth/admin'));
app.use('/Sadmin-auth', require('./auth/superadmin'));
app.use('/Sadmin', require('./routes/admin'));

app.post('/api/events', (req, res) => {
    const eventDetails = req.body;

    if (!eventDetails || Object.keys(eventDetails).length === 0) {
        return res.status(400).json({ message: 'Invalid request. No data received.' });
    }

   

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
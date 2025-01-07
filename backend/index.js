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




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
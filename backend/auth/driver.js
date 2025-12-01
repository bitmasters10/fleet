const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('../mongo');
const Driver = require('../models/Driver');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const Router = express.Router();
const session = require('express-session');

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
    { name: 'adharcard', maxCount: 1 },
    { name: 'pancard', maxCount: 1 }
]);

async function idmake(table, column) {
  let id = uuidv4();
  const exists = await Driver.findOne({ DRIVER_ID: id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

passport.use('driver-local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { name, phone_no, gender, license_no } = req.body;

    try {
        const driverId = await idmake('driver', 'DRIVER_ID');
        const hashedPassword = await bcrypt.hash(password, 10);

        const adharcard = req.files?.adharcard ? req.files.adharcard[0].buffer : null;
        const pancard = req.files?.pancard ? req.files.pancard[0].buffer : null;

        const newDriver = new Driver({
            DRIVER_ID: driverId,
            NAME: name,
            EMAIL_ID: email,
            GENDER: gender,
            PHONE_NO: phone_no,
            PASS: hashedPassword,
            LICENSE_NO: license_no,
            ADHARCARD: adharcard,
            PANCARD: pancard
        });

        await newDriver.save();
        return done(null, newDriver.toObject());
    } catch (err) {
        console.error('Error during registration:', err);
        return done(err);
    }
}));


passport.use('driver-local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await Driver.findOne({ EMAIL_ID: email }).lean();
        if (!user) return done(null, false, { message: 'No user found with this email.' });
        const isMatch = await bcrypt.compare(password, user.PASS);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.DRIVER_ID);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Driver.findOne({ DRIVER_ID: id }).lean();
        done(null, user);
    } catch (err) {
        done(err);
    }
});


    function logout(req, res) {
        req.logout((err) => {
            if (err) {
                console.error('Error logging out:', err);
                return res.status(500).json({ success: false, message: 'Logout failed.' });
            }
            res.status(200).json({ success: true, message: 'Successfully logged out.' });
        });
    }
    Router.post('/logout', (req, res) => {
        logout(req, res);
    });
    Router.post('/register', upload, (req, res, next) => {
        passport.authenticate('driver-local-register', (err, user, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'An error occurred during registration.' });
            }

            if (!user) {
            
                return res.status(400).json({ success: false, message: info.message || 'Registration failed.' });
            }

            res.status(200).json({ success: true, message: 'Registration successful!', user });
        })(req, res, next);
    });

    Router.post('/login', (req, res, next) => {
        passport.authenticate('driver-local-login', (err, user, info) => {
            if (err) {
        
                return res.status(500).json({ success: false, message: 'Internal server error', error: err });
            }
            if (!user) {
                
                return res.status(401).json({ success: false, message: info.message || 'Invalid credentials' });
            }


            req.logIn(user, (loginErr) => {
                if (loginErr) {
            
                    return res.status(500).json({ success: false, message: 'Login failed', error: loginErr });
                }
            
                return res.status(200).json({ success: true, message: 'Login successful', user: user });
            });
        })(req, res, next);
    });



    module.exports = Router;

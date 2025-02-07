const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const Router = express.Router();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

async function idmake(table, column) {
    let id = uuidv4();
    const query = `SELECT * FROM ${table} WHERE ${column} = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
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

passport.use(
    'driver-local-register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            const { name, phone_no, gender, license_no, adharcard, pancard } = req.body;

            try {
                // Generate unique DRIVER_ID
                const driverId = await idmake('DRIVER', 'DRIVER_ID');
                const hashedPassword = await bcrypt.hash(password, 10);

                // Expecting Base64 strings for images
                const newDriver = {
                    DRIVER_ID: driverId,
                    NAME: name,
                    EMAIL_ID: email,
                    GENDER: gender,
                    PHONE_NO: phone_no,
                    PASS: hashedPassword,
                    LICENSE_NO: license_no,
                    ADHARCARD: adharcard || null, // Base64 string
                    PANCARD: pancard || null, // Base64 string
                };

                db.query('INSERT INTO DRIVER SET ?', newDriver, (err) => {
                    if (err) return done(err);
                    return done(null, {
                        DRIVER_ID: newDriver.DRIVER_ID,
                        NAME: newDriver.NAME,
                        EMAIL_ID: newDriver.EMAIL_ID,
                        GENDER: newDriver.GENDER,
                        PHONE_NO: newDriver.PHONE_NO,
                        PASS: newDriver.PASS,
                        LICENSE_NO: newDriver.LICENSE_NO,
                    });
                });
            } catch (err) {
                console.error('Error during registration:', err);
                return done(err);
            }
        }
    )
);

    passport.use('driver-local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        
        db.query('SELECT * FROM DRIVER WHERE EMAIL_ID = ?', [email], async (err, rows) => {
            if (err) return done(err);

            if (rows.length === 0) {
                return done(null, false, { message: 'No user found with this email.' });
            }

            const user = rows[0];

            const isMatch = await bcrypt.compare(password, user.PASS);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }));


    passport.serializeUser((user, done) => {
        done(null, user.DRIVER_ID);
    });


    passport.deserializeUser((id, done) => {
        db.query('SELECT * FROM DRIVER WHERE DRIVER_ID = ?', [id], (err, rows) => {
            if (err) return done(err);
            done(null, rows[0]);
        });
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
    Router.post('/register', (req, res, next) => {
        passport.authenticate('driver-local-register', (err, user, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'An error occurred during registration.' });
            }
    
            if (!user) {
                return res.status(400).json({ success: false, message: info?.message || 'Registration failed.' });
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

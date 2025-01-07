const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Configure Multer for multiple file handling
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage }).fields([
    { name: 'adharcard', maxCount: 1 }, // Aadhaar card
    { name: 'pancard', maxCount: 1 }   // PAN card
]);

// Function to generate unique ID
async function idmake(table, column) {
    let id = uuidv4();
    const query = `SELECT * FROM ${table} WHERE ${column} = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err); // Reject the promise if there's an error
            }

            if (rows.length === 0) {
                return resolve(id); // Resolve the promise with the unique ID
            } else {
                // Recursively call idmake until a unique ID is found
                idmake(table, column).then(resolve).catch(reject);
            }
        });
    });
}

// Passport strategy for registration
passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { name, phone_no, gender, license_no } = req.body;

    try {
        // Generate unique DRIVER_ID
        const driverId = await idmake('DRIVER', 'DRIVER_ID');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if files are provided
        const adharcard = req.files?.adharcard ? req.files.adharcard[0].buffer : null;
        const pancard = req.files?.pancard ? req.files.pancard[0].buffer : null;

        const newDriver = {
            DRIVER_ID: driverId,
            NAME: name,
            EMAIL_ID: email,
            GENDER: gender,
            PHONE_NO: phone_no,
            PASS: hashedPassword,
            LICENSE_NO: license_no,
            ADHARCARD: adharcard, // Store Aadhaar card file data
            PANCARD: pancard      // Store PAN card file data
        };

        // Insert new driver into the database
        db.query('INSERT INTO DRIVER SET ?', newDriver, (err) => {
            if (err) return done(err);
            return done(null, newDriver);
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return done(err);
    }

}));

module.exports = { passport, upload, idmake };

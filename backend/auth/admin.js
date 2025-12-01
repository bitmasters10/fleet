const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('../mongo');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const Router = express.Router();
const session = require('express-session');
// note: session store will be switched to MongoDB in `index.js`

function isSuperAdmin(req, res, next) {
  
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

async function idmake(table, column) {
    let id = uuidv4();
    // Ensure generated id is unique in Admin collection
    const exists = await Admin.findOne({ aid: id }).lean();
    if (!exists) return id;
    return idmake(table, column);
}
passport.use('admin-local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { aname} = req.body;

    try {
       
        const Id = await idmake('fleetadmin', 'aid');
        const hashedPassword = await bcrypt.hash(password, 10);


      

        const newAdmin = new Admin({
            aid: Id,
            aname: aname,
            email: email,
            pass: hashedPassword,
        });
        await newAdmin.save();
        return done(null, { 
            aid: Id,
            aname: aname,
            email: email,
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return done(err);
    }

}));
passport.serializeUser((user, done) => {
    done(null, user.aid);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Admin.findOne({ aid: id }).lean();
        done(null, user);
    } catch (err) {
        done(err);
    }
});

Router.post('/register', isSuperAdmin, (req, res, next) => {
    passport.authenticate('admin-local-register', (err, user, info) => {
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

passport.use('admin-local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    
    try {
        const user = await Admin.findOne({ email }).lean();
        if (!user) return done(null, false, { message: 'No user found with this email.' });
        const isMatch = await bcrypt.compare(password, user.pass);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
Router.post('/login', (req, res, next) => {
    passport.authenticate('admin-local-login', (err, user, info) => {
        if (err) {
       
            return res.status(500).json({ success: false, message: 'Internal server error', error: err });
        }
        if (!user) {
            
            return res.status(401).json({ success: false, message: info.message || 'Invalid credentials' });
        }


        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Error in req.logIn:', loginErr);
                return res.status(500).json({ success: false, message: 'Login failed', error: loginErr });
            }
            console.log('Login successful:', user);
            return res.status(200).json({ success: true, message: 'Login successful', user: user });
        });
    })(req, res, next);
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
module.exports = Router;
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
passport.use('super-admin-local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { aname} = req.body;

    try {
       
        const Id = await idmake('fleetSuperAdmin', 'aid');
        const hashedPassword = await bcrypt.hash(password, 10);


      

        const newAdmin = {
            aid: Id,
            aname: aname,
            email: email,
            pass: hashedPassword,
          
        };

     
        db.query('INSERT INTO fleetSuperAdmin SET ?', newAdmin, (err) => {
            if (err) return done(err);
            return done(null, { 
                aid: Id,
                aname: aname,
                email: email,
            });
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return done(err);
    }

}));
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.aid);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM fleetSuperAdmin WHERE aid = ?', [id], (err, rows) => {
        if (err) return done(err);
        done(null, rows[0]);
    });
});

Router.post('/register', (req, res, next) => {
    passport.authenticate('super-admin-local-register', (err, user, info) => {
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

passport.use('super-admin-local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    
    db.query("SELECT * FROM fleetSuperAdmin WHERE email = ?", [email], async (err, rows) => {
        
        if (err) return done(err);

        if (rows.length === 0) {
            return done(null, false, { message: 'No user found with this email.' });
        }

        const user = rows[0];
console.log(user.pass+"&"+password)
const isMatch = await bcrypt.compare(password, user.pass);
console.log('Hashed password from DB:', user.pass);
console.log('Password entered:', password);
console.log('Password match result:', isMatch);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    });
}));
Router.post('/login', (req, res, next) => {
    passport.authenticate('super-admin-local-login', (err, user, info) => {
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
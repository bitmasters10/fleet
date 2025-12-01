const express = require('express');
const Router = express.Router();
require('../mongo');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

async function idmake(table, column) {
  let id = uuidv4();
  const exists = await User.findOne({ id }).lean();
  if (!exists) return id;
  return idmake(table, column);
}

function isAdmin(req, res, next) {
  console.log("Session:", req.session); // Log session data
  console.log("User:", req.user); // Log the user object

  if (!req.isAuthenticated() || !req.user) {
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    console.log("User role is not admin:", req.user.role);
    return res.status(403).json({ message: "Forbidden: You are not a admin." });
  }

  console.log("Role verified:", req.user.role);
  return next(); // Proceed if authenticated and role is superadmin
}
passport.use(
  "user-local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { first_name, last_name, mobile_no, sex, age } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newId = await idmake('users', 'id');
        const userDoc = new User({ id: newId, mobile_no, name: `${first_name} ${last_name}`, email });
        await userDoc.save();
        return done(null, userDoc.toObject());
      } catch (err) {
        console.error('Error during registration:', err);
        return done(err);
      }
    }
  )
);

Router.post('/register', isAdmin, (req, res, next) => {
  passport.authenticate("user-local-register", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "An error occurred during registration.",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: info.message || "Registration failed.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration successful!",
      user,
    });
  })(req, res, next);
});
Router.get('/users', isAdmin, async (req, res) => {
  try {
    const rows = await User.find().lean();
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error during retrieve:', err);
    return res.status(500).send('Server Error');
  }
});
module.exports = Router;

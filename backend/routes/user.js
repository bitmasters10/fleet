const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

async function idmake(table, column) {
  let id = uuidv4();

  const query = `SELECT * FROM ${table} WHERE ${column} = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
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
      const { first_name, last_name, mobile_no, sex } = req.body;

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          first_name,
          last_name,
          mobile_no,
          sex,
          email: email,
          password: hashedPassword,
        };

        // Insert new user into the database
        db.query("INSERT INTO users SET ?", newUser, (err, results) => {
          if (err) return done(err);

          // Fetch the id of the last inserted user
          const insertedId = results.insertId; // Get the auto-increment ID from the results
          db.query(
            "SELECT id FROM users WHERE id = ?",
            [insertedId],
            (err, rows) => {
              if (err) return done(err);

              const userId = rows[0].id;
              return done(null, {
                id: userId,
                first_name,
                last_name,
                mobile_no,
                sex,
                email: email,
              });
            }
          );
        });
      } catch (err) {
        console.error("Error during registration:", err);
        return done(err);
      }
    }
  )
);

Router.post("/register", (req, res, next) => {
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
Router.get("/users", (req, res) => {
  try {
    db.query("SELECT * FROM users ", (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.error("Error during retrive:", err);
  }
});
module.exports = Router;

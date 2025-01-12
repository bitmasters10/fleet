const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require('uuid');

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
    console.log('Session:', req.session); // Log session data
    console.log('User:', req.user); // Log the user object
  
    if (!req.isAuthenticated() || !req.user) {
        console.log('User is not authenticated');
        return res.status(401).json({ message: "Unauthorized access." });
    }
  
    if (req.user.role !== 'admin') {
        console.log('User role is not admin:', req.user.role);
        return res.status(403).json({ message: "Forbidden: You are not a admin." });
    }
  
    console.log('Role verified:', req.user.role);
    return next(); // Proceed if authenticated and role is superadmin
  }
  
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
  Router.get("/available-books", isAdmin, (req, res) => {
    const q = `
        SELECT 
            o.user_id, 
            o.capacity, 
            o.datetime, 
            o.product_name, 
            p.PID AS package_id,
            s.id
            p.PLACES
        FROM 
            success2 s
        JOIN 
            orders o 
        ON 
            REPLACE(s.order_id, 'order_id=', '') = o.order_id
        JOIN 
            PACKAGE p
        ON 
            o.product_name = p.name
        WHERE 
            s.order_status = ? AND s.fleet_status = ?
    `;
    try {
        db.query(q, ["order_status=Success", "waiting"], (err, rows) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send("Server Error");
            }
            return res.status(200).json(rows);
        });
    } catch (err) {
        console.log(err);
    }
});

Router.get("/test",(req,res)=>{
  const q = `
  SELECT order_id from success2 where fleet_status=? and order_status=? 
`;
try {
  db.query(q,["waiting","order_status=Success"], (err, rows) => {
      if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("Server Error");
      }
      return res.status(200).json(rows);
  });
} catch (err) {
  console.log(err);
}

})
Router.post("/add-package",async(req,res)=>{
  const {pid,name,places,duration}=req.body
  const Id = await idmake("fleetSuperAdmin", "aid");
  let newCar = {
    PID: Id,
    PROD_ID: pid,
    NAME: name,
    PLACES: places,
    DURATION: duration,
   
  };
  try {
    db.query('INSERT INTO PACKAGE SET ?', newCar, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json({message:"package",results:rows});
    });
  } catch (err) {
    console.error("Error during registration:", err);
  }

})
Router.post("/create-book",(req,res)=>{
  const {	TIMING,	PICKUP_LOC,	CAR_ID,	USER_ID,	BOOK_NO,	DATE,	NO_OF_PASSENGER,	PACKAGE_ID,	DROP_LOC,	AC_NONAC,	stat,	END_TIME,	VID}=req.body
})


module.exports = Router;
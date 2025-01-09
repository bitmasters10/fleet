const express = require("express");
const Router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require('uuid');


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
Router.get("/available-books",isAdmin,(req,res)=>{
    const q="select o.user_id,o.capacity,o.datetime,o.product_name  from success2 s join orders o on s.order_id=o.oreder_id where s.order_status=? and s.fleet_status=?"
    try{
        db.query(q,["Success","waiting"], (err, rows) => {
            if (err) {
              console.error("Error executing query:", err);
              return res.status(500).send("Server Error");
            }
            return res.status(200).json(rows);
          });

    }catch(err){
        console.log(err)
    }
})  
module.exports = Router;
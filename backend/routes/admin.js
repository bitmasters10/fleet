const express = require('express');
const Router = express.Router();
const db = require('../db');
function isSuperAdmin(req, res, next) {
    console.log('Session:', req.session); // Log session data
    console.log('User:', req.user); // Log the user object

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
Router.get("/admins",isSuperAdmin,async(req,res)=>{
    try{
        db.query('SELECT * FROM fleetAdmin ', (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                return  res.status(500).send('Server Error')

            }
            return res.status(200).json(rows)
        })

    }catch(err){
        console.error('Error during registration:', err);
    }
   
})
Router.get("/admin/:id",isSuperAdmin,async(req,res)=>{
    const { id } = req.params;
    const query = "SELECT * FROM fleetAdmin WHERE aid = ?;";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server Error');
            return;
        }
        return res.status(200).json(results)
    });
})
Router.delete("/admin/:id",isSuperAdmin,async(req,res)=>{
    const { id } = req.params;
    const query = "delete FROM fleetAdmin WHERE aid = ?;";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server Error');
            return;
        }
        return res.status(200).json({message:"delte doene",res:results})
    });
})

Router.patch('/admin/:id', isSuperAdmin,(req, res) => {
    const { id } = req.params;
    const { aname, email } = req.body;
    const query = 'UPDATE fleetAdmin SET aname = ?, email = ? WHERE aid = ?';
    db.query(query, [aname, email, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Server Error');
            return;
        }
        return res.status(200).json({message:"update doene",res:results})
    });
});

module.exports = Router;
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

Router.post("/create-car", async (req, res) => {
  const { CAR_NO, COLOR, CAR_TYPE,MODEL_NAME, COMPANY_NAME,SEATING_CAPACITY } = req.body;
  const Id = await idmake("fleetSuperAdmin", "aid");
  let newCar = {
    CAR_ID: Id,
    CAR_NO: CAR_NO,
    CAR_TYPE: CAR_TYPE,
    MODEL_NAME: MODEL_NAME,
    COLOR: COLOR,
    COMPANY_NAME: COMPANY_NAME,
    SEATING_CAPACITY: SEATING_CAPACITY,
  };
  try {
    db.query('INSERT INTO CARS SET ?', newCar, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server Error");
      }
      return res.status(200).json({message:"new car added",results:rows});
    });
  } catch (err) {
    console.error("Error during registration:", err);
  }
});

Router.get("/cars", async (req, res) => {
  try {
    db.query("SELECT * FROM CARS ", (err, rows) => {
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
Router.get("/car/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM CARS WHERE CAR_ID = ?;";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json(results);
  });
});
Router.delete("/car/:id", async (req, res) => {
  const { id } = req.params;
  const query = "delete FROM CARS WHERE car_ID = ?;";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "delte doene", res: results });
  });
});

Router.patch("/car/:id", (req, res) => {
  const { id } = req.params;
  const { CAR_NO, COLOR, CAR_TYPE,MODEL_NAME, COMPANY_NAME,SEATING_CAPACITY,STATUS } = req.body;
  const query = "UPDATE CARS SET 	CAR_NO=?,	CAR_TYPE=?	,MODEL_NAME= ?	,COLOR=?	,COMPANY_NAME=?	,SEATING_CAPACITY=?	,STATUS=?	WHERE CAR_ID = ?";
  db.query(query, [CAR_NO, COLOR, CAR_TYPE,MODEL_NAME, COMPANY_NAME,SEATING_CAPACITY,STATUS, id], (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "update doene", res: results });
  });
});
Router.patch("/car-status/:id", (req, res) => {
  const { id } = req.params;
  const { STATUS } = req.body;
  const query = "UPDATE CARS SET 	STATUS=?	WHERE CAR_ID = ?";
  db.query(query, [STATUS,id], (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Server Error");
      return;
    }
    return res.status(200).json({ message: "update doene", res: results });
  });
});
module.exports = Router;

const mysql = require('mysql2');



// const db = mysql.createPool({
//     host: 'fleet.lindatours.in',     
//      user: 'u820563802_Linda_fleet',          // Replace with your username
//     password: 'Fleet@1234',  // Replace with your password
//     database: 'u820563802_Linda_fleet',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     connectTimeout: 10000,
//   });


    
// const db = mysql.createPool({
//   host: 'localhost',     // Replace with your host
//    user: 'root',          // Replace with your username
//   password: '',  // Replace with your password
//   database: 'u820563802_Linda_fleet',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000,
// });



  
const db = mysql.createPool({
    host: 'fleet.lindatours.in',     
     user: 'u820563802_Linda_fleet',          // Replace with your username
    password: 'Fleet@1234',  // Replace with your password
    database: 'u820563802_Linda_fleet',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  });

  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database!');
      connection.release(); // Release connection back to the pool
    }
  });
  module.exports=db
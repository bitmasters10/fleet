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


    
const db = mysql.createPool({
  host: '193.203.184.214',     // Replace with your host
   user: 'u422792073_Fleet',          // Replace with your username
  password: 'MaqsadAli@911',  // Replace with your password
  database: 'u422792073_Fleet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});



  
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

  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database!');
      connection.release(); // Release connection back to the pool
    }
  });
  module.exports=db
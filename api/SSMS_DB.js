// const sql = require('mssql/msnodesqlv8');

// // Database configuration
// const config = {
//   connectionString: 'driver={ODBC Driver 17 for SQL Server};Server=LAPTOP-KU2OGEKV;Database=tech_365;UID=sa;PWD=sa;',
// };

// // const config = {
// //   connectionString: 'driver={ODBC Driver 17 for SQL Server};Server=192.168.0.50,1433;Database=tech_365;UID=administrator;PWD="t3ch365!!)";',
// // };

// // Function to connect to the database
// const connectDB = async () => {
//   try {
//     await sql.connect(config);
//     console.log('Connected to SQL Server!');
//   } catch (error) {
//     console.error('Error connecting to SQL Server:', error);
//     throw error;  // Throw error to be handled by the caller
//   }
// };
// connectDB()

// // Export the functions
// module.exports = { connectDB };

const sql = require("mssql");
require('dotenv').config(); // This line right here!
const config = {
  user: process.env.DB_USER, // This will now correctly resolve to 'admin'
  password: process.env.DB_PASSWORD, // This will resolve to 't3ch365!!)'
  server: process.env.DB_SERVER, // etc.
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (err) {
    console.error("DB Connection Failed:", err);
  }
}

connectDB(); // 👈 this runs the function when you execute the script

module.exports = { sql, connectDB };

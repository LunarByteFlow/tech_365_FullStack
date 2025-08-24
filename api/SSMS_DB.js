// const sql = require('mssql/msnodesqlv8');
const sql = require("mssql");

// Database configuration
// const config = {
//   connectionString: 'driver={ODBC Driver 17 for SQL Server};Server=LAPTOP-KU2OGEKV;Database=tech_365;UID=sa;PWD=sa;',
// };

// Database configuration
const config = {
  // Explicitly define the server name as a string (REQUIRED by Tedious)
  server: "LAPTOP-KU2OGEKV", // Your SQL Server name or IP address
  // server: "SQLSSMS",

  // Database name (REQUIRED)
  database: "tech_365",

  // Authentication details (REQUIRED for SQL Server Authentication)
  user: "sa", // Your SQL Server username
  password: "sa", // Your SQL Server password


  // user: "administrator", // Your SQL Server username
  // password: "t3ch365!!)", // Your SQL Server password
  // Connection options
  options: {
    // Set to true if your SQL Server requires SSL (e.g., Azure SQL).
    // For local development, it's often false unless you've configured SSL.
    encrypt: false,

    // Required for local development with self-signed certificates or if you don't want strict certificate validation.
    // In production, for public databases, you'd typically want this to be false with a trusted CA.
    trustServerCertificate: true,

    // You can also specify the port if it's not the default 1433
    // port: 1433,
  },
};
// const config = {
//   connectionString: 'driver={ODBC Driver 17 for SQL Server};Server=192.168.0.50,1433;Database=tech_365;UID=administrator;PWD="t3ch365!!)";',
// };

// Function to connect to the database
const connectDB = async () => {
  try {
    const pool = await sql.connect(config);
    await sql.connect(config);
    console.log("Connected to SQL Server!");
    return pool;
  } catch (error) {
    console.error("Error connecting to SQL Server:", error);
    throw error; // Throw error to be handled by the caller
  }
};
module.exports = {
  connectDB,
};

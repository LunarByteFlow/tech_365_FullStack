const sql = require('mssql');

const config = {
  server: '192.168.0.50', // Replace with your remote server IP or DNS
  port: 1433,
  user: 'administrator',              // or the SQL user you created
  password: 't3ch355!!)',          // your SQL password
  // database: 'tech_365',
  options: {
    encrypt: false, // set to true for Azure
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to remote SQL Server!');
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
};

connectDB();

module.exports = { connectDB };

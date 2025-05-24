const sql = require('mssql');

const config = {
  user: 'admin', // your RDS master username
  password: 't3ch365!!)',
  server: 'tech365database.c5a8ku0y26sx.eu-north-1.rds.amazonaws.com', // RDS endpoint from AWS console
  database: 'tech_365', // the DB name you restored
  port: 1433,
  options: {
    encrypt: true, // for Azure and AWS
    trustServerCertificate: true // for self-signed certs
  }
};

async function connectToDb() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('DB Connection Failed:', err);
  }
}

connectToDb(); // 👈 this runs the function when you execute the script

module.exports = { sql, connectToDb };

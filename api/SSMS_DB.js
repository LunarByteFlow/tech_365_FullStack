
const sql = require('mssql/msnodesqlv8');

// Database configuration
const config = {
  connectionString: 'driver={ODBC Driver 17 for SQL Server};Server=LAPTOP-KU2OGEKV;Database=tech_365;UID=sa;PWD=sa;',
};

// Function to connect to the database
const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server!');
  } catch (error) {
    console.error('Error connecting to SQL Server:', error);
    throw error;  // Throw error to be handled by the caller
  }
};
connectDB()

// Export the functions
module.exports = { connectDB };

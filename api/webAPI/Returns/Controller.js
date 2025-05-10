const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql/msnodesqlv8");

const Get_Returns = async (req, res) => {
  try {
    await connectDB(); // Connect to the database

    const request = new sql.Request();

    const result = await request.query(`SELECT * FROM Feb-Returns`);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No dispatch records found." });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching Returns data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
    Get_Returns,
};

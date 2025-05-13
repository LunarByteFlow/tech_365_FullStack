const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql/msnodesqlv8");

const getLowStockItems = async (req, res) => {
  try {
    await connectDB();
    const request = new sql.Request();
    const threshold = 5;

    const result = await request.query(`
      SELECT * FROM [Inventory & Order]
      WHERE Available <= ${threshold}
    `);

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching low stock:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const Get_Inventory_Order = async (req, res) => {
    try {
      await connectDB(); // Connect to the database
  
      const request = new sql.Request();
  
      const result = await request.query(`SELECT * FROM [Inventory & Order]`);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ success: false, message: "No dispatch records found." });
      }
  
      res.status(200).json({ success: true, data: result.recordset });
  
    } catch (error) {
      console.error("Error fetching dispatch data:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  module.exports = {
    Get_Inventory_Order,getLowStockItems
  }
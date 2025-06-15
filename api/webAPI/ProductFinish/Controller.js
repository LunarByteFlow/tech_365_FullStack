const sql = require("mssql");
const { connectDB } = require("../../SSMS_DB.js");

const GetAllProductFinishes = async (req, res) => {
  try {
    await connectDB();
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM ProductFinish");

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching product finishes:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const GetProductFinishById = async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();
    const request = new sql.Request();
    const result = await request
      .input("ProductFinish_ID", sql.Int, id)
      .query("SELECT * FROM ProductFinish WHERE ProductFinish_ID = @ProductFinish_ID");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const CreateProductFinish = async (req, res) => {
  const {
    OrderNo,
    QTY,
    Model,
    Brand,
    NeedPaper,
    Dispatched,
    Courier,
    FinishedBy,
    FinishDate,
    Area,
    SerialNumber,
  } = req.body;

  try {
    await connectDB();
    const request = new sql.Request();
    await request
      .input("OrderNo", sql.VarChar, OrderNo)
      .input("QTY", sql.Int, QTY)
      .input("Model", sql.VarChar, Model)
      .input("Brand", sql.VarChar, Brand)
      .input("NeedPaper", sql.Bit, NeedPaper)
      .input("Dispatched", sql.Bit, Dispatched)
      .input("Courier", sql.VarChar, Courier)
      .input("FinishedBy", sql.VarChar, FinishedBy)
      .input("FinishDate", sql.DateTime, FinishDate)
      .input("Area", sql.VarChar, Area)
      .input("SerialNumber", sql.VarChar, SerialNumber)
      .query(`
        INSERT INTO ProductFinish 
        (OrderNo, QTY, Model, Brand, NeedPaper, Dispatched, Courier, FinishedBy, FinishDate, Area, SerialNumber) 
        VALUES (@OrderNo, @QTY, @Model, @Brand, @NeedPaper, @Dispatched, @Courier, @FinishedBy, @FinishDate, @Area, @SerialNumber)
      `);

    res.status(201).json({ success: true, message: "Product finish created successfully." });
  } catch (error) {
    console.error("Error creating product finish:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const UpdateProductFinish = async (req, res) => {
  const { id } = req.params;
  const {
    OrderNo,
    QTY,
    Model,
    Brand,
    NeedPaper,
    Dispatched,
    Courier,
    FinishedBy,
    FinishDate,
    Area,
    SerialNumber,
  } = req.body;

  try {
    await connectDB();
    const request = new sql.Request();
    const result = await request
      .input("ProductFinish_ID", sql.Int, id)
      .input("OrderNo", sql.VarChar, OrderNo)
      .input("QTY", sql.Int, QTY)
      .input("Model", sql.VarChar, Model)
      .input("Brand", sql.VarChar, Brand)
      .input("NeedPaper", sql.Bit, NeedPaper)
      .input("Dispatched", sql.Bit, Dispatched)
      .input("Courier", sql.VarChar, Courier)
      .input("FinishedBy", sql.VarChar, FinishedBy)
      .input("FinishDate", sql.DateTime, FinishDate)
      .input("Area", sql.VarChar, Area)
      .input("SerialNumber", sql.VarChar, SerialNumber)
      .query(`
        UPDATE ProductFinish SET 
          OrderNo = @OrderNo,
          QTY = @QTY,
          Model = @Model,
          Brand = @Brand,
          NeedPaper = @NeedPaper,
          Dispatched = @Dispatched,
          Courier = @Courier,
          FinishedBy = @FinishedBy,
          FinishDate = @FinishDate,
          Area = @Area,
          SerialNumber = @SerialNumber
        WHERE ProductFinish_ID = @ProductFinish_ID
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Product finish updated successfully." });
  } catch (error) {
    console.error("Error updating product finish:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const DeleteProductFinish = async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();
    const request = new sql.Request();
    const result = await request
      .input("ProductFinish_ID", sql.Int, id)
      .query("DELETE FROM ProductFinish WHERE ProductFinish_ID = @ProductFinish_ID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Product finish deleted successfully." });
  } catch (error) {
    console.error("Error deleting product finish:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// GET all records (only selected fields)
const Get5ProductFinishesFields = async (req, res) => {
  try {
    await connectDB();
    const request = new sql.Request();
    const result = await request.query(`
      SELECT FinishedBy, FinishDate, QTY, Area, SerialNumber 
      FROM ProductFinish;
    `);

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching product finishes:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  GetAllProductFinishes,
  Get5ProductFinishesFields,
  GetProductFinishById,
  CreateProductFinish,
  UpdateProductFinish,
  DeleteProductFinish,
};

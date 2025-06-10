const { connectDB } = require("../../SSMS_DB");
// Adjust path as necessary to your DB connection
const sql = require("mssql");

// --- CREATE Part Inventory ---
const Create_PartInventory = async (req, res) => {
  const {
    Inventory_Parts_ID,
    Facility,
    Location_,
    Brand,
    Model,
    Type_, // Specific to Parts
    Comments, // Specific to Parts
    QTY_Recieved,
    QTY_On_Hand,
  } = req.body;

  // Basic validation for required fields
  if (!Inventory_Parts_ID || !Brand || !Model || !Type_) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Missing required fields: Inventory_Parts_ID, Brand, Model, Type_.",
      });
  }

  try {
    const pool = await connectDB(); // Ensure connectDB returns a pool object
    const request = pool.request();

    await request
      .input("Inventory_Parts_ID", sql.VarChar, Inventory_Parts_ID)
      .input("Facility", sql.VarChar, Facility)
      .input("Location_", sql.VarChar, Location_)
      .input("Brand", sql.VarChar, Brand)
      .input("Model", sql.VarChar, Model)
      .input("Type_", sql.VarChar, Type_)
      .input("Comments", sql.VarChar, Comments) // Input for Comments
      .input("QTY_Recieved", sql.Int, QTY_Recieved)
      .input("QTY_On_Hand", sql.Int, QTY_On_Hand)
      .query(`INSERT INTO [Inventory_Parts] (
                Inventory_Parts_ID, Facility, Location_, Brand, Model, Type_, Comments,
                QTY_Recieved, QTY_On_Hand
            ) VALUES (
                @Inventory_Parts_ID, @Facility, @Location_, @Brand, @Model, @Type_, @Comments,
                @QTY_Recieved, @QTY_On_Hand
            )`);

    res
      .status(201)
      .json({
        success: true,
        message: "Part inventory item created successfully.",
      });
  } catch (error) {
    console.error("Create Part Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- READ ALL Part Inventory ---
const Get_AllPartInventory = async (req, res) => {
  try {
    const pool = await connectDB();
    const request = pool.request();

    const result = await request.query("SELECT * FROM [Inventory_Parts]");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No part inventory records found." });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Get All Part Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- READ ONE Part Inventory (by ID) ---
const Get_PartInventoryById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Part Inventory ID is required in the URL.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    request.input("Inventory_Parts_ID", sql.VarChar, id);

    const result = await request.query(
      "SELECT * FROM [Inventory_Parts] WHERE Inventory_Parts_ID = @Inventory_Parts_ID"
    );

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Part inventory item not found." });
    }

    res.status(200).json({ success: true, data: result.recordset[0] }); // Return single object
  } catch (error) {
    console.error("Get Part Inventory by ID Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- UPDATE Part Inventory ---
const Update_PartInventory = async (req, res) => {
  const { id } = req.params; // Inventory_Parts_ID from URL parameter
  const {
    Facility,
    Location_,
    Brand,
    Model,
    Type_,
    Comments,
    QTY_Recieved,
    QTY_On_Hand,
  } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Part Inventory ID is required in the URL for update.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    const fieldsToUpdate = [];

    // Conditionally add fields to update if they are provided in the request body
    if (Facility !== undefined) {
      fieldsToUpdate.push("Facility = @Facility");
      request.input("Facility", sql.VarChar, Facility);
    }
    if (Location_ !== undefined) {
      fieldsToUpdate.push("Location_ = @Location_");
      request.input("Location_", sql.VarChar, Location_);
    }
    if (Brand !== undefined) {
      fieldsToUpdate.push("Brand = @Brand");
      request.input("Brand", sql.VarChar, Brand);
    }
    if (Model !== undefined) {
      fieldsToUpdate.push("Model = @Model");
      request.input("Model", sql.VarChar, Model);
    }
    if (Type_ !== undefined) {
      fieldsToUpdate.push("Type_ = @Type_");
      request.input("Type_", sql.VarChar, Type_);
    }
    if (Comments !== undefined) {
      fieldsToUpdate.push("Comments = @Comments");
      request.input("Comments", sql.VarChar, Comments);
    } // Comments field
    if (QTY_Recieved !== undefined) {
      fieldsToUpdate.push("QTY_Recieved = @QTY_Recieved");
      request.input("QTY_Recieved", sql.Int, QTY_Recieved);
    }
    if (QTY_On_Hand !== undefined) {
      fieldsToUpdate.push("QTY_On_Hand = @QTY_On_Hand");
      request.input("QTY_On_Hand", sql.Int, QTY_On_Hand);
    }

    if (fieldsToUpdate.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No fields to update provided in the request body.",
        });
    }

    request.input("Inventory_Parts_ID", sql.VarChar, id); // Use the ID from params for the WHERE clause

    const query = `
            UPDATE [Inventory_Parts]
            SET ${fieldsToUpdate.join(", ")}
            WHERE Inventory_Parts_ID = @Inventory_Parts_ID
        `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Part inventory item not found or no changes made.",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Part inventory item updated successfully.",
      });
  } catch (error) {
    console.error("Update Part Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- DELETE Part Inventory ---
const Delete_PartInventory = async (req, res) => {
  const { id } = req.params; // Inventory_Parts_ID from URL parameter

  if (!id) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Part Inventory ID is required in the URL.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    request.input("Inventory_Parts_ID", sql.VarChar, id);

    const result = await request.query(`
            DELETE FROM [Inventory_Parts]
            WHERE Inventory_Parts_ID = @Inventory_Parts_ID
        `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Part inventory item not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Part inventory item deleted successfully.",
      });
  } catch (error) {
    console.error("Delete Part Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// Export all controller functions
module.exports = {
  Create_PartInventory,
  Get_AllPartInventory,
  Get_PartInventoryById,
  Update_PartInventory,
  Delete_PartInventory,
};

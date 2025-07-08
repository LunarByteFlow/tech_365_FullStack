const sql = require("mssql");
const { connectDB } = require("../../SSMS_DB");
// --- CREATE Inventory Screen ---
const Create_InventoryScreen = async (req, res) => {
  const {
    Inventory_Screens_ID,
    Facility,
    Location_,
    Brand,
    Model,
    Screen_Size,
    Ports_,
    Stand,
    QTY_Recieved,
    QTY_On_Hand,
  } = req.body;

  // Basic required validation
  if (!Inventory_Screens_ID || !Brand || !Model || !Screen_Size) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Missing required fields: Inventory_Screens_ID, Brand, Model, Screen_Size.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    await request
      .input("Inventory_Screens_ID", sql.VarChar, Inventory_Screens_ID)
      .input("Facility", sql.VarChar, Facility)
      .input("Location_", sql.VarChar, Location_)
      .input("Brand", sql.VarChar, Brand)
      .input("Model", sql.VarChar, Model)
      .input("Screen_Size", sql.VarChar, Screen_Size)
      .input("Ports_", sql.VarChar, Ports_)
      .input("Stand", sql.VarChar, Stand)
      .input("QTY_Recieved", sql.Int, QTY_Recieved)
      .input("QTY_On_Hand", sql.Int, QTY_On_Hand).query(`
                INSERT INTO [Inventory_Screens] (
                    Inventory_Screens_ID, Facility, Location_, Brand, Model,
                    Screen_Size, Ports_, Stand, QTY_Recieved, QTY_On_Hand
                ) VALUES (
                    @Inventory_Screens_ID, @Facility, @Location_, @Brand, @Model,
                    @Screen_Size, @Ports_, @Stand, @QTY_Recieved, @QTY_On_Hand
                )
            `);

    res
      .status(201)
      .json({
        success: true,
        message: "Inventory screen item created successfully.",
      });
  } catch (error) {
    console.error("Create Inventory Screen Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- READ ALL Inventory Screens ---
const Get_AllInventoryScreens = async (req, res) => {
  try {
    console.log("connectDB:", connectDB);
    const pool = await connectDB();
    const request = pool.request();
    console.log("pool:", pool); 

    const result = await request.query("SELECT * FROM [Inventory_Screens]");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No inventory screen records found.",
        });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Get All Inventory Screens Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- READ ONE Inventory Screen by ID ---
const Get_InventoryScreenById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Inventory Screen ID is required in the URL.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    request.input("Inventory_Screens_ID", sql.VarChar, id);

    const result = await request.query(
      "SELECT * FROM [Inventory_Screens] WHERE Inventory_Screens_ID = @Inventory_Screens_ID"
    );

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory screen item not found." });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("Get Inventory Screen by ID Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- UPDATE Inventory Screen ---
const Update_InventoryScreen = async (req, res) => {
  const { id } = req.params;
  const {
    Facility,
    Location_,
    Brand,
    Model,
    Screen_Size,
    Ports_,
    Stand,
    QTY_Recieved,
    QTY_On_Hand,
  } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Inventory Screen ID is required in the URL for update.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    const fieldsToUpdate = [];

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
    if (Screen_Size !== undefined) {
      fieldsToUpdate.push("Screen_Size = @Screen_Size");
      request.input("Screen_Size", sql.VarChar, Screen_Size);
    }
    if (Ports_ !== undefined) {
      fieldsToUpdate.push("Ports_ = @Ports_");
      request.input("Ports_", sql.VarChar, Ports_);
    }
    if (Stand !== undefined) {
      fieldsToUpdate.push("Stand = @Stand");
      request.input("Stand", sql.VarChar, Stand);
    }
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
        .json({ success: false, message: "No fields to update provided." });
    }

    request.input("Inventory_Screens_ID", sql.VarChar, id);

    const query = `
            UPDATE [Inventory_Screens]
            SET ${fieldsToUpdate.join(", ")}
            WHERE Inventory_Screens_ID = @Inventory_Screens_ID
        `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Inventory screen item not found or no changes made.",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Inventory screen item updated successfully.",
      });
  } catch (error) {
    console.error("Update Inventory Screen Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// --- DELETE Inventory Screen ---
const Delete_InventoryScreen = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Inventory Screen ID is required in the URL.",
      });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();

    request.input("Inventory_Screens_ID", sql.VarChar, id);

    const result = await request.query(`
            DELETE FROM [Inventory_Screens]
            WHERE Inventory_Screens_ID = @Inventory_Screens_ID
        `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory screen item not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Inventory screen item deleted successfully.",
      });
  } catch (error) {
    console.error("Delete Inventory Screen Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error." });
  }
};

// Export all controller functions
module.exports = {
  Create_InventoryScreen,
  Get_AllInventoryScreens,
  Get_InventoryScreenById,
  Update_InventoryScreen,
  Delete_InventoryScreen,
};

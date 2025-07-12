const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");

// CREATE
const Create_Inventory = async (req, res) => {
  const {
    Facility,
    Location_,
    Brand,
    Model,
    Screen_Size,
    Processor,
    RAM,
    Hard_Drive,
    Stand,
    QTY_Recieved,
    QTY_On_Hand
  } = req.body;

  // if (!InventoryAO_ID || !Brand || !Model) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }

  try {
    await connectDB();
    const request = new sql.Request();

    await request
      // .input("InventoryAO_ID", sql.VarChar, InventoryAO_ID)
      .input("Facility", sql.VarChar, Facility)
      .input("Location_", sql.VarChar, Location_)
      .input("Brand", sql.VarChar, Brand)
      .input("Model", sql.VarChar, Model)
      .input("Screen_Size", sql.VarChar, Screen_Size)
      .input("Processor", sql.VarChar, Processor)
      .input("RAM", sql.VarChar, RAM)
      .input("Hard_Drive", sql.VarChar, Hard_Drive)
      .input("Stand", sql.VarChar, Stand)
      .input("QTY_Recieved", sql.Int, QTY_Recieved)
      .input("QTY_On_Hand", sql.Int, QTY_On_Hand)
      .query(`INSERT INTO [Inventory_AO] (
         Facility, Location_, Brand, Model, Screen_Size, Processor,
        RAM, Hard_Drive, Stand, QTY_Recieved, QTY_On_Hand
      ) VALUES (
        @Facility, @Location_, @Brand, @Model, @Screen_Size, @Processor,
        @RAM, @Hard_Drive, @Stand, @QTY_Recieved, @QTY_On_Hand
      )`);

    res.status(201).json({ success: true, message: "Inventory created" });
  } catch (error) {
    console.error("Create Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// READ ALL
const Get_Inventory = async (req, res) => {
  try {
    await connectDB();
    const request = new sql.Request();

    const result = await request.query("SELECT * FROM [Inventory_AO]");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No inventory records found." });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Get Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE (Modified to use req.params for ID)
const Update_Inventory = async (req, res) => {
  // Get InventoryAO_ID from URL parameters
  const { id } = req.params;

  // Get update fields from the request body
  const {
    Facility,
    Location_,
    Brand,
    Model,
    Screen_Size,
    Processor,
    RAM,
    Hard_Drive,
    Stand,
    QTY_Recieved,
    QTY_On_Hand,
  } = req.body;

  // Ensure InventoryAO_ID is provided in the URL
  if (!id) {
    return res.status(400).json({ message: "InventoryAO_ID is required in the URL for update." });
  }

  try {
    await connectDB();
    const request = new sql.Request();

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
    if (Screen_Size !== undefined) {
      fieldsToUpdate.push("Screen_Size = @Screen_Size");
      request.input("Screen_Size", sql.VarChar, Screen_Size);
    }
    if (Processor !== undefined) {
      fieldsToUpdate.push("Processor = @Processor");
      request.input("Processor", sql.VarChar, Processor);
    }
    if (RAM !== undefined) {
      fieldsToUpdate.push("RAM = @RAM");
      request.input("RAM", sql.VarChar, RAM);
    }
    if (Hard_Drive !== undefined) {
      fieldsToUpdate.push("Hard_Drive = @Hard_Drive");
      request.input("Hard_Drive", sql.VarChar, Hard_Drive);
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

    // If no fields are provided for update in the body, return an error
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields to update provided in the request body." });
    }

    // Input the InventoryAO_ID from params for the WHERE clause
    request.input("InventoryAO_ID", sql.VarChar, id);

    const query = `
      UPDATE [Inventory_AO]
      SET ${fieldsToUpdate.join(", ")}
      WHERE InventoryAO_ID = @InventoryAO_ID
    `;

    // Execute the update query
    const result = await request.query(query);

    // Check if any rows were affected to confirm the update
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Inventory item not found or no changes made." });
    }

    res.status(200).json({ success: true, message: "Inventory updated successfully." });
  } catch (error) {
    console.error("Update Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE
const Delete_Inventory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "InventoryAO_ID is required." });
  }

  try {
    await connectDB();
    const request = new sql.Request();

    request.input("InventoryAO_ID", sql.VarChar, id);

    const result = await request.query(`
      DELETE FROM [Inventory_AO]
      WHERE InventoryAO_ID = @InventoryAO_ID
    `);

    res.status(200).json({ success: true, message: "Inventory deleted successfully." });
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  Create_Inventory,
  Get_Inventory,
  Update_Inventory,
  Delete_Inventory
};

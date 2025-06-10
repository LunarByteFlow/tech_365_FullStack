const { connectDB } = require("../../SSMS_DB"); // Assuming SSMS_DB.js is two levels up
const sql = require("mssql"); // For SQL data types and Request object

// --- CREATE ---
const Create_DesktopInventory = async (req, res) => {
    const {
        Inventory_Desktops_ID,
        Facility,
        Location_,
        Brand,
        Model,
        Type_,       // New field for Desktops
        Processor,
        RAM,
        Hard_Drive,
        QTY_Recieved,
        QTY_On_Hand
    } = req.body;

    // Basic validation for required fields
    if (!Inventory_Desktops_ID || !Brand || !Model || !Type_) {
        return res.status(400).json({ message: "Missing required fields: Inventory_Desktops_ID, Brand, Model, Type_" });
    }

    try {
        const pool = await connectDB(); // connectDB should return the pool
        const request = pool.request(); // Use the pool's request method

        await request
            .input("Inventory_Desktops_ID", sql.VarChar, Inventory_Desktops_ID)
            .input("Facility", sql.VarChar, Facility)
            .input("Location_", sql.VarChar, Location_)
            .input("Brand", sql.VarChar, Brand)
            .input("Model", sql.VarChar, Model)
            .input("Type_", sql.VarChar, Type_) // Input for Type_
            .input("Processor", sql.VarChar, Processor)
            .input("RAM", sql.VarChar, RAM)
            .input("Hard_Drive", sql.VarChar, Hard_Drive)
            .input("QTY_Recieved", sql.Int, QTY_Recieved)
            .input("QTY_On_Hand", sql.Int, QTY_On_Hand)
            .query(`INSERT INTO [Inventory_Desktops] (
                Inventory_Desktops_ID, Facility, Location_, Brand, Model, Type_, Processor,
                RAM, Hard_Drive, QTY_Recieved, QTY_On_Hand
            ) VALUES (
                @Inventory_Desktops_ID, @Facility, @Location_, @Brand, @Model, @Type_, @Processor,
                @RAM, @Hard_Drive, @QTY_Recieved, @QTY_On_Hand
            )`);

        res.status(201).json({ success: true, message: "Desktop inventory item created successfully." });
    } catch (error) {
        console.error("Create Desktop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- READ ALL ---
const Get_AllDesktopInventory = async (req, res) => {
    try {
        const pool = await connectDB();
        const request = pool.request();

        const result = await request.query("SELECT * FROM [Inventory_Desktops]");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "No desktop inventory records found." });
        }

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error("Get All Desktop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- READ ONE (by ID) ---
// This was not explicitly asked for but is a common and useful endpoint
const Get_DesktopInventoryById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Desktop Inventory ID is required in the URL." });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input("Inventory_Desktops_ID", sql.VarChar, id);

        const result = await request.query("SELECT * FROM [Inventory_Desktops] WHERE Inventory_Desktops_ID = @Inventory_Desktops_ID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Desktop inventory item not found." });
        }

        res.status(200).json({ success: true, data: result.recordset[0] }); // Return single object
    } catch (error) {
        console.error("Get Desktop Inventory by ID Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- UPDATE ---
const Update_DesktopInventory = async (req, res) => {
    const { id } = req.params; // Inventory_Desktops_ID from URL parameter
    const {
        Facility,
        Location_,
        Brand,
        Model,
        Type_,
        Processor,
        RAM,
        Hard_Drive,
        QTY_Recieved,
        QTY_On_Hand,
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Desktop Inventory ID is required in the URL for update." });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        const fieldsToUpdate = [];

        // Conditionally add fields to update if they are provided in the request body
        if (Facility !== undefined) { fieldsToUpdate.push("Facility = @Facility"); request.input("Facility", sql.VarChar, Facility); }
        if (Location_ !== undefined) { fieldsToUpdate.push("Location_ = @Location_"); request.input("Location_", sql.VarChar, Location_); }
        if (Brand !== undefined) { fieldsToUpdate.push("Brand = @Brand"); request.input("Brand", sql.VarChar, Brand); }
        if (Model !== undefined) { fieldsToUpdate.push("Model = @Model"); request.input("Model", sql.VarChar, Model); }
        if (Type_ !== undefined) { fieldsToUpdate.push("Type_ = @Type_"); request.input("Type_", sql.VarChar, Type_); } // Type_ field
        if (Processor !== undefined) { fieldsToUpdate.push("Processor = @Processor"); request.input("Processor", sql.VarChar, Processor); }
        if (RAM !== undefined) { fieldsToUpdate.push("RAM = @RAM"); request.input("RAM", sql.VarChar, RAM); }
        if (Hard_Drive !== undefined) { fieldsToUpdate.push("Hard_Drive = @Hard_Drive"); request.input("Hard_Drive", sql.VarChar, Hard_Drive); }
        if (QTY_Recieved !== undefined) { fieldsToUpdate.push("QTY_Recieved = @QTY_Recieved"); request.input("QTY_Recieved", sql.Int, QTY_Recieved); }
        if (QTY_On_Hand !== undefined) { fieldsToUpdate.push("QTY_On_Hand = @QTY_On_Hand"); request.input("QTY_On_Hand", sql.Int, QTY_On_Hand); }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "No fields to update provided in the request body." });
        }

        request.input("Inventory_Desktops_ID", sql.VarChar, id); // Use the ID from params for the WHERE clause

        const query = `
            UPDATE [Inventory_Desktops]
            SET ${fieldsToUpdate.join(", ")}
            WHERE Inventory_Desktops_ID = @Inventory_Desktops_ID
        `;

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Desktop inventory item not found or no changes made." });
        }

        res.status(200).json({ success: true, message: "Desktop inventory item updated successfully." });
    } catch (error) {
        console.error("Update Desktop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- DELETE ---
const Delete_DesktopInventory = async (req, res) => {
    const { id } = req.params; // Inventory_Desktops_ID from URL parameter

    if (!id) {
        return res.status(400).json({ message: "Desktop Inventory ID is required in the URL." });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input("Inventory_Desktops_ID", sql.VarChar, id);

        const result = await request.query(`
            DELETE FROM [Inventory_Desktops]
            WHERE Inventory_Desktops_ID = @Inventory_Desktops_ID
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Desktop inventory item not found." });
        }

        res.status(200).json({ success: true, message: "Desktop inventory item deleted successfully." });
    } catch (error) {
        console.error("Delete Desktop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// Export all controller functions
module.exports = {
    Create_DesktopInventory,
    Get_AllDesktopInventory,
    Get_DesktopInventoryById, // Added Get_DesktopInventoryById
    Update_DesktopInventory,
    Delete_DesktopInventory
};
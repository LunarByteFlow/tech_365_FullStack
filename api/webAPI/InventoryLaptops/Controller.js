const { connectDB } = require("../SSMS_DB"); // Adjust path as necessary to your DB connection
const sql = require("mssql");

// --- CREATE Laptop Inventory ---
const Create_LaptopInventory = async (req, res) => {
    const {
        Inventory_Laptops_ID,
        Facility,
        Location_,
        Brand,
        Model,
        Desk_Type,    // Specific to Laptops
        Processor,
        RAM,
        Hard_Drive,
        Screen_Size,  // Specific to Laptops
        Resolution,   // Specific to Laptops
        QTY_Recieved,
        QTY_On_Hand
    } = req.body;

    // Basic validation for required fields
    if (!Inventory_Laptops_ID || !Brand || !Model) {
        return res.status(400).json({ success: false, message: "Missing required fields: Inventory_Laptops_ID, Brand, Model." });
    }

    try {
        const pool = await connectDB(); // Ensure connectDB returns a pool object
        const request = pool.request();

        await request
            .input("Inventory_Laptops_ID", sql.VarChar, Inventory_Laptops_ID)
            .input("Facility", sql.VarChar, Facility)
            .input("Location_", sql.VarChar, Location_)
            .input("Brand", sql.VarChar, Brand)
            .input("Model", sql.VarChar, Model)
            .input("Desk_Type", sql.VarChar, Desk_Type)
            .input("Processor", sql.VarChar, Processor)
            .input("RAM", sql.VarChar, RAM)
            .input("Hard_Drive", sql.VarChar, Hard_Drive)
            .input("Screen_Size", sql.VarChar, Screen_Size)
            .input("Resolution", sql.VarChar, Resolution)
            .input("QTY_Recieved", sql.Int, QTY_Recieved)
            .input("QTY_On_Hand", sql.Int, QTY_On_Hand)
            .query(`INSERT INTO [Inventory_Laptops] (
                Inventory_Laptops_ID, Facility, Location_, Brand, Model, Desk_Type, Processor,
                RAM, Hard_Drive, Screen_Size, Resolution, QTY_Recieved, QTY_On_Hand
            ) VALUES (
                @Inventory_Laptops_ID, @Facility, @Location_, @Brand, @Model, @Desk_Type, @Processor,
                @RAM, @Hard_Drive, @Screen_Size, @Resolution, @QTY_Recieved, @QTY_On_Hand
            )`);

        res.status(201).json({ success: true, message: "Laptop inventory item created successfully." });
    } catch (error) {
        console.error("Create Laptop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- READ ALL Laptop Inventory ---
const Get_AllLaptopInventory = async (req, res) => {
    try {
        const pool = await connectDB();
        const request = pool.request();

        const result = await request.query("SELECT * FROM [Inventory_Laptops]");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "No laptop inventory records found." });
        }

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error("Get All Laptop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- READ ONE Laptop Inventory (by ID) ---
const Get_LaptopInventoryById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Laptop Inventory ID is required in the URL." });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input("Inventory_Laptops_ID", sql.VarChar, id);

        const result = await request.query("SELECT * FROM [Inventory_Laptops] WHERE Inventory_Laptops_ID = @Inventory_Laptops_ID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Laptop inventory item not found." });
        }

        res.status(200).json({ success: true, data: result.recordset[0] }); // Return single object
    } catch (error) {
        console.error("Get Laptop Inventory by ID Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- UPDATE Laptop Inventory ---
const Update_LaptopInventory = async (req, res) => {
    const { id } = req.params; // Inventory_Laptops_ID from URL parameter
    const {
        Facility,
        Location_,
        Brand,
        Model,
        Desk_Type,
        Processor,
        RAM,
        Hard_Drive,
        Screen_Size,
        Resolution,
        QTY_Recieved,
        QTY_On_Hand,
    } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: "Laptop Inventory ID is required in the URL for update." });
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
        if (Desk_Type !== undefined) { fieldsToUpdate.push("Desk_Type = @Desk_Type"); request.input("Desk_Type", sql.VarChar, Desk_Type); }
        if (Processor !== undefined) { fieldsToUpdate.push("Processor = @Processor"); request.input("Processor", sql.VarChar, Processor); }
        if (RAM !== undefined) { fieldsToUpdate.push("RAM = @RAM"); request.input("RAM", sql.VarChar, RAM); }
        if (Hard_Drive !== undefined) { fieldsToUpdate.push("Hard_Drive = @Hard_Drive"); request.input("Hard_Drive", sql.VarChar, Hard_Drive); }
        if (Screen_Size !== undefined) { fieldsToUpdate.push("Screen_Size = @Screen_Size"); request.input("Screen_Size", sql.VarChar, Screen_Size); }
        if (Resolution !== undefined) { fieldsToUpdate.push("Resolution = @Resolution"); request.input("Resolution", sql.VarChar, Resolution); }
        if (QTY_Recieved !== undefined) { fieldsToUpdate.push("QTY_Recieved = @QTY_Recieved"); request.input("QTY_Recieved", sql.Int, QTY_Recieved); }
        if (QTY_On_Hand !== undefined) { fieldsToUpdate.push("QTY_On_Hand = @QTY_On_Hand"); request.input("QTY_On_Hand", sql.Int, QTY_On_Hand); }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update provided in the request body." });
        }

        request.input("Inventory_Laptops_ID", sql.VarChar, id); // Use the ID from params for the WHERE clause

        const query = `
            UPDATE [Inventory_Laptops]
            SET ${fieldsToUpdate.join(", ")}
            WHERE Inventory_Laptops_ID = @Inventory_Laptops_ID
        `;

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Laptop inventory item not found or no changes made." });
        }

        res.status(200).json({ success: true, message: "Laptop inventory item updated successfully." });
    } catch (error) {
        console.error("Update Laptop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// --- DELETE Laptop Inventory ---
const Delete_LaptopInventory = async (req, res) => {
    const { id } = req.params; // Inventory_Laptops_ID from URL parameter

    if (!id) {
        return res.status(400).json({ success: false, message: "Laptop Inventory ID is required in the URL." });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input("Inventory_Laptops_ID", sql.VarChar, id);

        const result = await request.query(`
            DELETE FROM [Inventory_Laptops]
            WHERE Inventory_Laptops_ID = @Inventory_Laptops_ID
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Laptop inventory item not found." });
        }

        res.status(200).json({ success: true, message: "Laptop inventory item deleted successfully." });
    } catch (error) {
        console.error("Delete Laptop Inventory Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error." });
    }
};

// Export all controller functions
module.exports = {
    Create_LaptopInventory,
    Get_AllLaptopInventory,
    Get_LaptopInventoryById,
    Update_LaptopInventory,
    Delete_LaptopInventory
};
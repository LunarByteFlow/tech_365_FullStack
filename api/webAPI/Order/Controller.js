const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");

const postAnOrder = async (req, res) => {
  const {
    PackedBy, BuiltBy, InstallBy, ItemType, OrderNo, QTY,
    Model, Brand, SERIALNo, Processor, RAM, HardDrive, OS,
    Cable, Comment, Courier, Dispatched, OrderID, PostCode,
    DispatchDate, Prebuilt_Or_Inventory,
    // Removed OrderSheet_ID here
  } = req.body;

  if (!OrderNo || !Model || !Brand || !SERIALNo) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    await connectDB();

    const request = new sql.Request();

    await request
      .input("PackedBy", sql.VarChar, PackedBy)
      .input("BuiltBy", sql.VarChar, BuiltBy)
      .input("InstallBy", sql.VarChar, InstallBy)
      .input("ItemType", sql.VarChar, ItemType)
      .input("OrderNo", sql.VarChar, OrderNo)
      .input("QTY", sql.Int, QTY)
      .input("Model", sql.VarChar, Model)
      .input("Brand", sql.VarChar, Brand)
      .input("SERIALNo", sql.VarChar, SERIALNo)
      .input("Processor", sql.VarChar, Processor)
      .input("RAM", sql.VarChar, RAM)
      .input("HardDrive", sql.VarChar, HardDrive)
      .input("OS", sql.VarChar, OS)
      .input("Cable", sql.VarChar, Cable)
      .input("Comment", sql.NVarChar(sql.MAX), Comment)
      .input("Courier", sql.VarChar, Courier)
      .input("Dispatched", sql.VarChar, Dispatched)
      .input("OrderID", sql.VarChar, OrderID)
      .input("PostCode", sql.VarChar, PostCode)
      .input("DispatchDate", sql.VarChar, DispatchDate)
      .input("Prebuilt_Or_Inventory", sql.VarChar, Prebuilt_Or_Inventory)
      // Removed input for OrderSheet_ID here

      .query(`
        INSERT INTO [OrderSheet] (
          PackedBy, BuiltBy, InstallBy, ItemType, OrderNo, QTY, Model, Brand,
          SERIALNo, Processor, RAM, HardDrive, OS, Cable, Comment, Courier,
          Dispatched, OrderID, PostCode, DispatchDate, Prebuilt_Or_Inventory
          -- Removed OrderSheet_ID column here
        )
        VALUES (
          @PackedBy, @BuiltBy, @InstallBy, @ItemType, @OrderNo, @QTY, @Model, @Brand,
          @SERIALNo, @Processor, @RAM, @HardDrive, @OS, @Cable, @Comment, @Courier,
          @Dispatched, @OrderID, @PostCode, @DispatchDate, @Prebuilt_Or_Inventory
          -- Removed @OrderSheet_ID value here
        )
      `);

    res.status(201).json({ success: true, message: "Order added successfully." });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update_Order: leave OrderSheet_ID as is if you want to update it (but usually you don't update identity columns)
// If OrderSheet_ID is identity, it's better to NOT update it:
const Update_Order = async (req, res) => {
  const {
    OrderNo, PackedBy, BuiltBy, InstallBy, ItemType, QTY,
    Model, Brand, SERIALNo, Processor, RAM, HardDrive, OS,
    Cable, Comment, Courier, Dispatched, OrderID, PostCode,
    DispatchDate, Prebuilt_Or_Inventory,
    // Removed OrderSheet_ID from update fields
  } = req.body;

  if (!OrderNo) {
    return res.status(400).json({ message: "OrderNo is required for update." });
  }

  try {
    await connectDB();
    const request = new sql.Request();

    const fieldsToUpdate = [];

    if (PackedBy !== undefined) fieldsToUpdate.push(`PackedBy = @PackedBy`) && request.input('PackedBy', sql.VarChar, PackedBy);
    if (BuiltBy !== undefined) fieldsToUpdate.push(`BuiltBy = @BuiltBy`) && request.input('BuiltBy', sql.VarChar, BuiltBy);
    if (InstallBy !== undefined) fieldsToUpdate.push(`InstallBy = @InstallBy`) && request.input('InstallBy', sql.VarChar, InstallBy);
    if (ItemType !== undefined) fieldsToUpdate.push(`ItemType = @ItemType`) && request.input('ItemType', sql.VarChar, ItemType);
    if (QTY !== undefined) fieldsToUpdate.push(`QTY = @QTY`) && request.input('QTY', sql.Int, QTY);
    if (Model !== undefined) fieldsToUpdate.push(`Model = @Model`) && request.input('Model', sql.VarChar, Model);
    if (Brand !== undefined) fieldsToUpdate.push(`Brand = @Brand`) && request.input('Brand', sql.VarChar, Brand);
    if (SERIALNo !== undefined) fieldsToUpdate.push(`SERIALNo = @SERIALNo`) && request.input('SERIALNo', sql.VarChar, SERIALNo);
    if (Processor !== undefined) fieldsToUpdate.push(`Processor = @Processor`) && request.input('Processor', sql.VarChar, Processor);
    if (RAM !== undefined) fieldsToUpdate.push(`RAM = @RAM`) && request.input('RAM', sql.VarChar, RAM);
    if (HardDrive !== undefined) fieldsToUpdate.push(`HardDrive = @HardDrive`) && request.input('HardDrive', sql.VarChar, HardDrive);
    if (OS !== undefined) fieldsToUpdate.push(`OS = @OS`) && request.input('OS', sql.VarChar, OS);
    if (Cable !== undefined) fieldsToUpdate.push(`Cable = @Cable`) && request.input('Cable', sql.VarChar, Cable);
    if (Comment !== undefined) fieldsToUpdate.push(`Comment = @Comment`) && request.input('Comment', sql.NVarChar(sql.MAX), Comment);
    if (Courier !== undefined) fieldsToUpdate.push(`Courier = @Courier`) && request.input('Courier', sql.VarChar, Courier);
    if (Dispatched !== undefined) fieldsToUpdate.push(`Dispatched = @Dispatched`) && request.input('Dispatched', sql.VarChar, Dispatched);
    if (OrderID !== undefined) fieldsToUpdate.push(`OrderID = @OrderID`) && request.input('OrderID', sql.VarChar, OrderID);
    if (PostCode !== undefined) fieldsToUpdate.push(`PostCode = @PostCode`) && request.input('PostCode', sql.VarChar, PostCode);
    if (DispatchDate !== undefined) fieldsToUpdate.push(`DispatchDate = @DispatchDate`) && request.input('DispatchDate', sql.VarChar, DispatchDate);
    if (Prebuilt_Or_Inventory !== undefined) fieldsToUpdate.push(`Prebuilt_Or_Inventory = @Prebuilt_Or_Inventory`) && request.input('Prebuilt_Or_Inventory', sql.VarChar, Prebuilt_Or_Inventory);
    // Removed update for OrderSheet_ID here

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields provided for update." });
    }

    request.input("OrderNo", sql.VarChar, OrderNo);

    const updateQuery = `
      UPDATE [OrderSheet]
      SET ${fieldsToUpdate.join(", ")}
      WHERE OrderNo = @OrderNo
    `;

    const result = await request.query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, message: "Order updated successfully." });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const Get_Orders = async (req, res) => {
  try {
    await connectDB();
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM [OrderSheet]");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found." });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const Get_SingleOrderById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Order ID required." });
  }

  try {
    await connectDB();
    const request = new sql.Request();
    request.input("OrderSheet_ID", sql.VarChar, id);

    const result = await request.query("SELECT * FROM [OrderSheet] WHERE OrderSheet_ID = @OrderSheet_ID");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const Delete_OrderById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Order ID required." });
  }

  try {
    await connectDB();
    const request = new sql.Request();
    request.input("OrderSheet_ID", sql.VarChar, id);

    const result = await request.query("DELETE FROM [OrderSheet] WHERE OrderSheet_ID = @OrderSheet_ID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "No order found to delete." });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  postAnOrder,
  Update_Order,
  Get_Orders,
  Delete_OrderById,
  Get_SingleOrderById
};

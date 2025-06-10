const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");

const postAnOrder = async (req, res) => {
  const {
    PackedBy,
    BuiltBy,
    InstallBy,
    ItemType,
    OrderNo,
    QTY,
    Model,
    Brand,
    SERIALNo,
    Processor,
    RAM,
    HardDrive,
    OS,
    Cable,
    Comment,
    Courier,
    Dispatched,
    OrderID,
    PostCode,
    DispatchDate,
    Prebuilt_Or_Inventory,
    OrderSheet_ID,
  } = req.body;

  if (!OrderNo || !Model || !Brand || !SERIALNo) {
    return res.status(403).json({ message: "Missing Required Fields" });
  }

  let transaction;

  try {
    await connectDB();

    transaction = new sql.Transaction();
    await transaction.begin();

    // Step 1: Check available stock
    const stockRequest = new sql.Request(transaction);
    const stockResult = await stockRequest
      .input("Model", sql.VarChar, Model)
      .query(`SELECT Available FROM [Inventory & Order] WHERE Model = @Model`);

    const availableStock = stockResult.recordset[0]?.Available;

    if (availableStock === undefined) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: `Item with Model ${Model} not found in inventory.`,
      });
    }

    if (availableStock < QTY) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Not enough stock for model ${Model}.`,
      });
    }

    // Step 2: Deduct ordered quantity from inventory
    const updateRequest = new sql.Request(transaction);
    await updateRequest
      .input("Model", sql.VarChar, Model)
      .input("QTY", sql.Int, QTY)
      .query(`
        UPDATE [Inventory & Order]
        SET Available = Available - @QTY
        WHERE Model = @Model
      `);

    // Step 3: Insert the order into the OrderSheet table
    const insertRequest = new sql.Request(transaction);
    await insertRequest
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
      .input("OrderSheet_ID", sql.VarChar, OrderSheet_ID)
      .query(`
        INSERT INTO [OrderSheet](
          PackedBy, BuiltBy, InstallBy, ItemType, OrderNo, QTY, Model, Brand, SERIALNo,
          Processor, RAM, HardDrive, OS, Cable, Comment, Courier, Dispatched, OrderID,
          PostCode, DispatchDate, Prebuilt_Or_Inventory, OrderSheet_ID
        ) VALUES (
          @PackedBy, @BuiltBy, @InstallBy, @ItemType, @OrderNo, @QTY, @Model, @Brand, @SERIALNo,
          @Processor, @RAM, @HardDrive, @OS, @Cable, @Comment, @Courier, @Dispatched, @OrderID,
          @PostCode, @DispatchDate, @Prebuilt_Or_Inventory, @OrderSheet_ID
        )
      `);

    // Commit transaction
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Order added successfully and inventory updated.",
    });
  } catch (error) {
    console.error("Error creating order:", error);

    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Error during transaction rollback:", rollbackError);
      }
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const Update_Order = async (req, res) => {
  const {
    OrderNo, // Needed for update identification
    PackedBy,
    BuiltBy,
    InstallBy,
    ItemType,
    QTY,
    Model,
    Brand,
    SERIALNo,
    Processor,
    RAM,
    HardDrive,
    OS,
    Cable,
    Comment,
    Courier,
    Dispatched,
    OrderID,
    PostCode,
    DispatchDate,
    Prebuilt_Or_Inventory,
    OrderSheet_ID,
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
    if (OrderSheet_ID !== undefined) fieldsToUpdate.push(`OrderSheet_ID = @OrderSheet_ID`) && request.input('OrderSheet_ID', sql.VarChar, OrderSheet_ID);

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields to update provided." });
    }

    const query = `
      UPDATE [OrderSheet]
      SET ${fieldsToUpdate.join(", ")}
      WHERE OrderNo = @OrderNo
    `;

    request.input('OrderNo', sql.VarChar, OrderNo);

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "No order found with the provided OrderNo." });
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

    const result = await request.query(`SELECT * FROM [OrderSheet]`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No order records found." });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching order data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  postAnOrder,
  Update_Order,
  Get_Orders,
};

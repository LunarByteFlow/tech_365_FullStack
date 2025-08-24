const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // Multer setup for file handling

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

const Upload_CSV = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No CSV file uploaded." });
  }

  const filePath = req.file.path;

  try {
    const results = await parseCSV(filePath);

    await connectDB();

    for (const row of results) {
      // Validate required fields
      // if (!row.OrderNo || !row.Model || !row.Brand || !row.SERIALNo) {
      //   continue; // Skip rows with missing required fields
      // }

      try {
        const requestCheck = new sql.Request();

        // Check if this OrderNo + SERIALNo already exists
        const duplicateCheck = await requestCheck
          .input("OrderNo", sql.VarChar, row.OrderNo)
          .input("SERIALNo", sql.VarChar, row.SERIALNo).query(`
            SELECT COUNT(*) AS count 
            FROM [OrderSheet] 
            WHERE OrderNo = @OrderNo AND SERIALNo = @SERIALNo
          `);

        if (duplicateCheck.recordset[0].count > 0) {
          console.log(
            `Duplicate found for OrderNo: ${row.OrderNo}, SERIALNo: ${row.SERIALNo}. Skipping insert.`
          );
          continue; // Skip duplicate
        }

        const requestInsert = new sql.Request();

        await requestInsert
          .input("PackedBy", sql.VarChar, row.PackedBy || null)
          .input("BuiltBy", sql.VarChar, row.BuiltBy || null)
          .input("InstallBy", sql.VarChar, row.InstallBy || null)
          .input("ItemType", sql.VarChar, row.ItemType || null)
          .input("OrderNo", sql.VarChar, row.OrderNo)
          .input("QTY", sql.Int, row.QTY || 0)
          .input("Model", sql.VarChar, row.Model)
          .input("Brand", sql.VarChar, row.Brand)
          .input("SERIALNo", sql.VarChar, row.SERIALNo)
          .input("Processor", sql.VarChar, row.Processor || null)
          .input("RAM", sql.VarChar, row.RAM || null)
          .input("HardDrive", sql.VarChar, row.HardDrive || null)
          .input("OS", sql.VarChar, row.OS || null)
          .input("Cable", sql.VarChar, row.Cable || null)
          .input("Comment", sql.NVarChar(sql.MAX), row.Comment || null)
          .input("Courier", sql.VarChar, row.Courier || null)
          .input("Dispatched", sql.VarChar, row.Dispatched || null)
          .input("OrderID", sql.VarChar, row.OrderID || null)
          .input("PostCode", sql.VarChar, row.PostCode || null)
          .input("DispatchDate", sql.VarChar, row.DispatchDate || null)
          .input(
            "Prebuilt_Or_Inventory",
            sql.VarChar,
            row.Prebuilt_Or_Inventory || null
          ).query(`
            INSERT INTO [OrderSheet] (
              PackedBy, BuiltBy, InstallBy, ItemType, OrderNo, QTY, Model, Brand,
              SERIALNo, Processor, RAM, HardDrive, OS, Cable, Comment, Courier,
              Dispatched, OrderID, PostCode, DispatchDate, Prebuilt_Or_Inventory
            )
            VALUES (
              @PackedBy, @BuiltBy, @InstallBy, @ItemType, @OrderNo, @QTY, @Model, @Brand,
              @SERIALNo, @Processor, @RAM, @HardDrive, @OS, @Cable, @Comment, @Courier,
              @Dispatched, @OrderID, @PostCode, @DispatchDate, @Prebuilt_Or_Inventory
            )
          `);
      } catch (dbError) {
        console.error("Database insertion error for row:", row, dbError);
        continue; // Skip this row and continue
      }
    }

    fs.unlinkSync(filePath); // Clean up the uploaded file

    res
      .status(201)
      .json({ success: true, message: "CSV uploaded successfully." });
  } catch (err) {
    console.error("Error processing CSV:", err);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean up in case of CSV read errors
    }
    res
      .status(500)
      .json({ success: false, message: "Server error processing CSV." });
  }
};

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
    // Removed OrderSheet_ID here
  } = req.body;

  // if (!OrderNo || !Model || !Brand || !SERIALNo) {
  //   return res.status(400).json({ message: "Missing required fields." });
  // }

  try {
    await connectDB();

    const request = new sql.Request();

    await // Removed input for OrderSheet_ID here

    request
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

    res
      .status(201)
      .json({ success: true, message: "Order added successfully." });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update_Order: leave OrderSheet_ID as is if you want to update it (but usually you don't update identity columns)
// If OrderSheet_ID is identity, it's better to NOT update it:
const Update_Order = async (req, res) => {
  const {
    OrderNo,
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
    // Removed OrderSheet_ID from update fields
  } = req.body;

  if (!OrderNo) {
    return res.status(400).json({ message: "OrderNo is required for update." });
  }

  try {
    await connectDB();
    const request = new sql.Request();

    const fieldsToUpdate = [];

    if (PackedBy !== undefined)
      fieldsToUpdate.push(`PackedBy = @PackedBy`) &&
        request.input("PackedBy", sql.VarChar, PackedBy);
    if (BuiltBy !== undefined)
      fieldsToUpdate.push(`BuiltBy = @BuiltBy`) &&
        request.input("BuiltBy", sql.VarChar, BuiltBy);
    if (InstallBy !== undefined)
      fieldsToUpdate.push(`InstallBy = @InstallBy`) &&
        request.input("InstallBy", sql.VarChar, InstallBy);
    if (ItemType !== undefined)
      fieldsToUpdate.push(`ItemType = @ItemType`) &&
        request.input("ItemType", sql.VarChar, ItemType);
    if (QTY !== undefined)
      fieldsToUpdate.push(`QTY = @QTY`) && request.input("QTY", sql.Int, QTY);
    if (Model !== undefined)
      fieldsToUpdate.push(`Model = @Model`) &&
        request.input("Model", sql.VarChar, Model);
    if (Brand !== undefined)
      fieldsToUpdate.push(`Brand = @Brand`) &&
        request.input("Brand", sql.VarChar, Brand);
    if (SERIALNo !== undefined)
      fieldsToUpdate.push(`SERIALNo = @SERIALNo`) &&
        request.input("SERIALNo", sql.VarChar, SERIALNo);
    if (Processor !== undefined)
      fieldsToUpdate.push(`Processor = @Processor`) &&
        request.input("Processor", sql.VarChar, Processor);
    if (RAM !== undefined)
      fieldsToUpdate.push(`RAM = @RAM`) &&
        request.input("RAM", sql.VarChar, RAM);
    if (HardDrive !== undefined)
      fieldsToUpdate.push(`HardDrive = @HardDrive`) &&
        request.input("HardDrive", sql.VarChar, HardDrive);
    if (OS !== undefined)
      fieldsToUpdate.push(`OS = @OS`) && request.input("OS", sql.VarChar, OS);
    if (Cable !== undefined)
      fieldsToUpdate.push(`Cable = @Cable`) &&
        request.input("Cable", sql.VarChar, Cable);
    if (Comment !== undefined)
      fieldsToUpdate.push(`Comment = @Comment`) &&
        request.input("Comment", sql.NVarChar(sql.MAX), Comment);
    if (Courier !== undefined)
      fieldsToUpdate.push(`Courier = @Courier`) &&
        request.input("Courier", sql.VarChar, Courier);
    if (Dispatched !== undefined)
      fieldsToUpdate.push(`Dispatched = @Dispatched`) &&
        request.input("Dispatched", sql.VarChar, Dispatched);
    if (OrderID !== undefined)
      fieldsToUpdate.push(`OrderID = @OrderID`) &&
        request.input("OrderID", sql.VarChar, OrderID);
    if (PostCode !== undefined)
      fieldsToUpdate.push(`PostCode = @PostCode`) &&
        request.input("PostCode", sql.VarChar, PostCode);
    if (DispatchDate !== undefined)
      fieldsToUpdate.push(`DispatchDate = @DispatchDate`) &&
        request.input("DispatchDate", sql.VarChar, DispatchDate);
    if (Prebuilt_Or_Inventory !== undefined)
      fieldsToUpdate.push(`Prebuilt_Or_Inventory = @Prebuilt_Or_Inventory`) &&
        request.input(
          "Prebuilt_Or_Inventory",
          sql.VarChar,
          Prebuilt_Or_Inventory
        );
    // Removed update for OrderSheet_ID here

    if (fieldsToUpdate.length === 0) {
      return res
        .status(400)
        .json({ message: "No fields provided for update." });
    }

    request.input("OrderNo", sql.VarChar, OrderNo);

    const updateQuery = `
      UPDATE [OrderSheet]
      SET ${fieldsToUpdate.join(", ")}
      WHERE OrderNo = @OrderNo
    `;

    const result = await request.query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated successfully." });
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
      return res
        .status(404)
        .json({ success: false, message: "No orders found." });
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
    return res
      .status(400)
      .json({ success: false, message: "Order ID required." });
  }

  try {
    await connectDB();
    const request = new sql.Request();
    request.input("OrderSheet_ID", sql.VarChar, id);

    const result = await request.query(
      "SELECT * FROM [OrderSheet] WHERE OrderSheet_ID = @OrderSheet_ID"
    );

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
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
    return res
      .status(400)
      .json({ success: false, message: "Order ID required." });
  }

  try {
    await connectDB();
    const request = new sql.Request();
    request.input("OrderSheet_ID", sql.VarChar, id);

    const result = await request.query(
      "DELETE FROM [OrderSheet] WHERE OrderSheet_ID = @OrderSheet_ID"
    );

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No order found to delete." });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully." });
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
  Get_SingleOrderById,
  Upload_CSV,
  upload,
};

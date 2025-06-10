const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");

// Get all returns
const Get_Returns = async (req, res) => {
  try {
    await connectDB();

    const request = new sql.Request();

    const result = await request.query(`
      SELECT 
        Order_Returns_ID,
        ReturnCode,
        RMA,
        OrderNumber,
        RetunTrackingNumber,
        Model,
        Return_Type,
        Cable_And_Charger,
        Comments,
        Action_Required,
        Process
      FROM Order_Returns
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No return records found." });
    }

    res.status(200).json({ success: true, data: result.recordset });

  } catch (error) {
    console.error("Error fetching Returns data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get single return by ID
const Get_Return_By_ID = async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();

    const request = new sql.Request();
    request.input("Order_Returns_ID", sql.Int, id);

    const result = await request.query(`
      SELECT 
        Order_Returns_ID,
        ReturnCode,
        RMA,
        OrderNumber,
        RetunTrackingNumber,
        Model,
        Return_Type,
        Cable_And_Charger,
        Comments,
        Action_Required,
        Process
      FROM Order_Returns
      WHERE Order_Returns_ID = @Order_Returns_ID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Return record not found." });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });

  } catch (error) {
    console.error("Error fetching return by ID:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Create a new return record
const Create_Return = async (req, res) => {
  const {
    ReturnCode,
    RMA,
    OrderNumber,
    RetunTrackingNumber,
    Model,
    Return_Type,
    Cable_And_Charger,
    Comments,
    Action_Required,
    Process,
  } = req.body;

  try {
    await connectDB();

    const request = new sql.Request();

    await request
      .input("ReturnCode", sql.VarChar, ReturnCode)
      .input("RMA", sql.VarChar, RMA)
      .input("OrderNumber", sql.VarChar, OrderNumber)
      .input("RetunTrackingNumber", sql.VarChar, RetunTrackingNumber)
      .input("Model", sql.VarChar, Model)
      .input("Return_Type", sql.VarChar, Return_Type)
      .input("Cable_And_Charger", sql.VarChar, Cable_And_Charger)
      .input("Comments", sql.NVarChar(sql.MAX), Comments)
      .input("Action_Required", sql.VarChar, Action_Required)
      .input("Process", sql.VarChar, Process)
      .query(`
        INSERT INTO Order_Returns (
          ReturnCode,
          RMA,
          OrderNumber,
          RetunTrackingNumber,
          Model,
          Return_Type,
          Cable_And_Charger,
          Comments,
          Action_Required,
          Process
        ) VALUES (
          @ReturnCode,
          @RMA,
          @OrderNumber,
          @RetunTrackingNumber,
          @Model,
          @Return_Type,
          @Cable_And_Charger,
          @Comments,
          @Action_Required,
          @Process
        )
      `);

    res.status(201).json({ success: true, message: "Return record created successfully." });

  } catch (error) {
    console.error("Error creating return record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update a return record by ID
const Update_Return = async (req, res) => {
  const { id } = req.params;

  const {
    ReturnCode,
    RMA,
    OrderNumber,
    RetunTrackingNumber,
    Model,
    Return_Type,
    Cable_And_Charger,
    Comments,
    Action_Required,
    Process,
  } = req.body;

  try {
    await connectDB();

    const request = new sql.Request();

    // Build dynamic update query parts
    const fieldsToUpdate = [];
    if (ReturnCode !== undefined) {
      fieldsToUpdate.push("ReturnCode = @ReturnCode");
      request.input("ReturnCode", sql.VarChar, ReturnCode);
    }
    if (RMA !== undefined) {
      fieldsToUpdate.push("RMA = @RMA");
      request.input("RMA", sql.VarChar, RMA);
    }
    if (OrderNumber !== undefined) {
      fieldsToUpdate.push("OrderNumber = @OrderNumber");
      request.input("OrderNumber", sql.VarChar, OrderNumber);
    }
    if (RetunTrackingNumber !== undefined) {
      fieldsToUpdate.push("RetunTrackingNumber = @RetunTrackingNumber");
      request.input("RetunTrackingNumber", sql.VarChar, RetunTrackingNumber);
    }
    if (Model !== undefined) {
      fieldsToUpdate.push("Model = @Model");
      request.input("Model", sql.VarChar, Model);
    }
    if (Return_Type !== undefined) {
      fieldsToUpdate.push("Return_Type = @Return_Type");
      request.input("Return_Type", sql.VarChar, Return_Type);
    }
    if (Cable_And_Charger !== undefined) {
      fieldsToUpdate.push("Cable_And_Charger = @Cable_And_Charger");
      request.input("Cable_And_Charger", sql.VarChar, Cable_And_Charger);
    }
    if (Comments !== undefined) {
      fieldsToUpdate.push("Comments = @Comments");
      request.input("Comments", sql.NVarChar(sql.MAX), Comments);
    }
    if (Action_Required !== undefined) {
      fieldsToUpdate.push("Action_Required = @Action_Required");
      request.input("Action_Required", sql.VarChar, Action_Required);
    }
    if (Process !== undefined) {
      fieldsToUpdate.push("Process = @Process");
      request.input("Process", sql.VarChar, Process);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    request.input("Order_Returns_ID", sql.Int, id);

    const query = `
      UPDATE Order_Returns
      SET ${fieldsToUpdate.join(", ")}
      WHERE Order_Returns_ID = @Order_Returns_ID
    `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Return record not found." });
    }

    res.status(200).json({ success: true, message: "Return record updated successfully." });

  } catch (error) {
    console.error("Error updating return record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Delete a return record by ID
const Delete_Return = async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();

    const request = new sql.Request();
    request.input("Order_Returns_ID", sql.Int, id);

    const result = await request.query(`
      DELETE FROM Order_Returns
      WHERE Order_Returns_ID = @Order_Returns_ID
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Return record not found." });
    }

    res.status(200).json({ success: true, message: "Return record deleted successfully." });

  } catch (error) {
    console.error("Error deleting return record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  Get_Returns,
  Get_Return_By_ID,
  Create_Return,
  Update_Return,
  Delete_Return,
};

const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql/msnodesqlv8");

const Post_Dispatch = async (req, res) => {
    const {
      Type,
      Order_No,
      QTY,
      Model,
      Brand,
      Serial_No,
      Cable,
      Accessories,
      Label,
      Post_Code,
      Date,
      Dispatch_ID
    } = req.body;
  
    // Check if required fields are provided
    if (!Order_No || !Model || !Brand || !Serial_No) {
      return res.status(403).json({ message: "Missing Required Fields" });
    }
  
    try {
      await connectDB(); // Ensure you're connected to the database
  
      // Create a new SQL Request object
      const request = new sql.Request();
  
      // Set up the parameters for the query
      await request.input('Type', sql.VarChar, Type)
                    .input('Order_No', sql.VarChar, Order_No)
                    .input('QTY', sql.Int, QTY)
                    .input('Model', sql.VarChar, Model)
                    .input('Brand', sql.VarChar, Brand)
                    .input('Serial_No', sql.VarChar, Serial_No)
                    .input('Cable', sql.VarChar, Cable)
                    .input('Accessories', sql.VarChar, Accessories)
                    .input('Label', sql.VarChar, Label)
                    .input('Post_Code', sql.VarChar, Post_Code)
                    .input('Date', sql.VarChar, Date)
                    .input('Dispatch_ID', sql.VarChar, Dispatch_ID)
                    .query(`INSERT INTO [February Order Sheet2](
                      Type, Order_No, QTY, Model, Brand, Serial_No, Cable, Accessories,
                      Label, Post_Code, Date, Dispatch_ID
                    ) VALUES (
                      @Type, @Order_No, @QTY, @Model, @Brand, @Serial_No, @Cable, @Accessories,
                      @Label, @Post_Code, @Date, @Dispatch_ID
                    )`);
  
      res.status(201).json({ success: true, message: 'Order added successfully' });
  
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const Update_Dispatch = async (req, res) => {
    const {
      Type,
      Order_No,
      QTY,
      Model,
      Brand,
      Serial_No,
      Cable,
      Accessories,
      Label,
      Post_Code,
      Date,
      Dispatch_ID
    } = req.body;
  
    // Check if required fields are provided
    if (!Order_No) {
      return res.status(400).json({ message: "Order_No is required for update." });
    }
  
    try {
      await connectDB(); // Connect to the database
  
      const request = new sql.Request();
  
      // Prepare the fields to update
      const fieldsToUpdate = [];
  
      if (Type !== undefined) fieldsToUpdate.push("Type = @Type") && request.input('Type', sql.VarChar, Type);
      if (QTY !== undefined) fieldsToUpdate.push("QTY = @QTY") && request.input('QTY', sql.Int, QTY);
      if (Model !== undefined) fieldsToUpdate.push("Model = @Model") && request.input('Model', sql.VarChar, Model);
      if (Brand !== undefined) fieldsToUpdate.push("Brand = @Brand") && request.input('Brand', sql.VarChar, Brand);
      if (Serial_No !== undefined) fieldsToUpdate.push("Serial_No = @Serial_No") && request.input('Serial_No', sql.VarChar, Serial_No);
      if (Cable !== undefined) fieldsToUpdate.push("Cable = @Cable") && request.input('Cable', sql.VarChar, Cable);
      if (Accessories !== undefined) fieldsToUpdate.push("Accessories = @Accessories") && request.input('Accessories', sql.VarChar, Accessories);
      if (Label !== undefined) fieldsToUpdate.push("Label = @Label") && request.input('Label', sql.VarChar, Label);
      if (Post_Code !== undefined) fieldsToUpdate.push("Post_Code = @Post_Code") && request.input('Post_Code', sql.VarChar, Post_Code);
      if (Date !== undefined) fieldsToUpdate.push("Date = @Date") && request.input('Date', sql.VarChar, Date);
      if (Dispatch_ID !== undefined) fieldsToUpdate.push("Dispatch_ID = @Dispatch_ID") && request.input('Dispatch_ID', sql.VarChar, Dispatch_ID);
  
      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: "No fields to update provided." });
      }
  
      // Check if the order exists first
      const checkResult = await request
        .input('Order_No_Check', sql.VarChar, Order_No)
        .query(`SELECT COUNT(*) AS count FROM [February Order Sheet2] WHERE Order_No = @Order_No_Check`);
  
      const count = checkResult.recordset[0].count;
      if (count === 0) {
        return res.status(404).json({ success: false, message: "No order found with the provided Order_No." });
      }
  
      // Now perform the update
      const updateRequest = new sql.Request();
      updateRequest.input('Order_No', sql.VarChar, Order_No);
  
      // Rebind fields for update
      if (Type !== undefined) updateRequest.input('Type', sql.VarChar, Type);
      if (QTY !== undefined) updateRequest.input('QTY', sql.Int, QTY);
      if (Model !== undefined) updateRequest.input('Model', sql.VarChar, Model);
      if (Brand !== undefined) updateRequest.input('Brand', sql.VarChar, Brand);
      if (Serial_No !== undefined) updateRequest.input('Serial_No', sql.VarChar, Serial_No);
      if (Cable !== undefined) updateRequest.input('Cable', sql.VarChar, Cable);
      if (Accessories !== undefined) updateRequest.input('Accessories', sql.VarChar, Accessories);
      if (Label !== undefined) updateRequest.input('Label', sql.VarChar, Label);
      if (Post_Code !== undefined) updateRequest.input('Post_Code', sql.VarChar, Post_Code);
      if (Date !== undefined) updateRequest.input('Date', sql.VarChar, Date);
      if (Dispatch_ID !== undefined) updateRequest.input('Dispatch_ID', sql.VarChar, Dispatch_ID);
  
      const query = `
        UPDATE [February Order Sheet2]
        SET ${fieldsToUpdate.join(", ")}
        WHERE Order_No = @Order_No
      `;
  
      await updateRequest.query(query);
  
      res.status(200).json({ success: true, message: "Order updated successfully." });
  
    } catch (error) {
      console.error("Error updating dispatch order:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  const Get_Dispatch = async (req, res) => {
    try {
      await connectDB(); // Connect to the database
  
      const request = new sql.Request();
  
      const result = await request.query(`SELECT * FROM Dispatch`);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ success: false, message: "No dispatch records found." });
      }
  
      res.status(200).json({ success: true, data: result.recordset });
  
    } catch (error) {
      console.error("Error fetching dispatch data:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  
  
module.exports = {
    Post_Dispatch
    // , getAllOrders
    ,Update_Dispatch,
    Get_Dispatch
  };
  
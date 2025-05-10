const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql/msnodesqlv8");

const postAnOrder = async (req, res) => {
  const {
    PKD_By,
    Built_By,
    INS_By,
    Type,
    Order_No,
    QTY,
    Model,
    Brand,
    SERIAL_No,
    Description,
    Hard_Drive,
    Ram,
    OS,
    Cable,
    KB_Mice,
    Prime,
    Dispatched,
    Labels,
    Post_Code,
    Disp_Date,
    MU,
  } = req.body;

  if (!Order_No || !Model || !Brand || !SERIAL_No) {
    return res.status(403).json({ message: "Missing Required Fields" });
  }

  try {
    await connectDB(); // Ensure you're connected to the database

    // Create a new SQL Request object
    const request = new sql.Request();

    // Set up the parameters for the query
    await request
      .input("PKD_By", sql.VarChar, PKD_By)
      .input("Built_By", sql.VarChar, Built_By)
      .input("INS_By", sql.VarChar, INS_By)
      .input("Type", sql.VarChar, Type)
      .input("Order_No", sql.VarChar, Order_No)
      .input("QTY", sql.Int, QTY)
      .input("Model", sql.VarChar, Model)
      .input("Brand", sql.VarChar, Brand)
      .input("SERIAL_No", sql.VarChar, SERIAL_No)
      .input("Description", sql.NVarChar(sql.MAX), Description)
      .input("Hard_Drive", sql.VarChar, Hard_Drive)
      .input("Ram", sql.VarChar, Ram)
      .input("OS", sql.VarChar, OS)
      .input("Cable", sql.VarChar, Cable)
      .input("KB_Mice", sql.VarChar, KB_Mice)
      .input("Prime", sql.VarChar, Prime)
      .input("Dispatched", sql.VarChar, Dispatched)
      .input("Labels", sql.VarChar, Labels)
      .input("Post_Code", sql.VarChar, Post_Code)
      .input("Disp_Date", sql.VarChar, Disp_Date)
      .input("MU", sql.VarChar, MU).query(`INSERT INTO [February Order Sheet2](
                    PKD_By, Built_By, INS_By, Type, Order_No, QTY, Model, Brand, SERIAL_No,
                    Description, Hard_Drive, Ram, OS, Cable, KB_Mice, Prime, Dispatched, Labels,
                    Post_Code, Disp_Date, MU
                  ) VALUES (
                    @PKD_By, @Built_By, @INS_By, @Type, @Order_No, @QTY, @Model, @Brand,
                    @SERIAL_No, @Description, @Hard_Drive, @Ram, @OS, @Cable, @KB_Mice, @Prime,
                    @Dispatched, @Labels, @Post_Code, @Disp_Date, @MU
                  )`);

    res
      .status(201)
      .json({ success: true, message: "Order added successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


const Update_Order = async (req, res) => {
  const {
    Order_No, // Needed to find which record to update
    PKD_By,
    Built_By,
    INS_By,
    Type,
    QTY,
    Model,
    Brand,
    SERIAL_No,
    Description,
    Hard_Drive,
    Ram,
    OS,
    Cable,
    KB_Mice,
    Prime,
    Dispatched,
    Labels,
    Post_Code,
    Disp_Date,
    MU,
  } = req.body;

  if (!Order_No) {
    return res.status(400).json({ message: "Order_No is required for update." });
  }

  try {
    await connectDB();
    const request = new sql.Request();

    // Prepare fields to update
    const fieldsToUpdate = [];

    if (PKD_By !== undefined) fieldsToUpdate.push(`PKD_By = @PKD_By`) && request.input('PKD_By', sql.VarChar, PKD_By);
    if (Built_By !== undefined) fieldsToUpdate.push(`Built_By = @Built_By`) && request.input('Built_By', sql.VarChar, Built_By);
    if (INS_By !== undefined) fieldsToUpdate.push(`INS_By = @INS_By`) && request.input('INS_By', sql.VarChar, INS_By);
    if (Type !== undefined) fieldsToUpdate.push(`Type = @Type`) && request.input('Type', sql.VarChar, Type);
    if (QTY !== undefined) fieldsToUpdate.push(`QTY = @QTY`) && request.input('QTY', sql.Int, QTY);
    if (Model !== undefined) fieldsToUpdate.push(`Model = @Model`) && request.input('Model', sql.VarChar, Model);
    if (Brand !== undefined) fieldsToUpdate.push(`Brand = @Brand`) && request.input('Brand', sql.VarChar, Brand);
    if (SERIAL_No !== undefined) fieldsToUpdate.push(`SERIAL_No = @SERIAL_No`) && request.input('SERIAL_No', sql.VarChar, SERIAL_No);
    if (Description !== undefined) fieldsToUpdate.push(`Description = @Description`) && request.input('Description', sql.NVarChar(sql.MAX), Description);
    if (Hard_Drive !== undefined) fieldsToUpdate.push(`Hard_Drive = @Hard_Drive`) && request.input('Hard_Drive', sql.VarChar, Hard_Drive);
    if (Ram !== undefined) fieldsToUpdate.push(`Ram = @Ram`) && request.input('Ram', sql.VarChar, Ram);
    if (OS !== undefined) fieldsToUpdate.push(`OS = @OS`) && request.input('OS', sql.VarChar, OS);
    if (Cable !== undefined) fieldsToUpdate.push(`Cable = @Cable`) && request.input('Cable', sql.VarChar, Cable);
    if (KB_Mice !== undefined) fieldsToUpdate.push(`KB_Mice = @KB_Mice`) && request.input('KB_Mice', sql.VarChar, KB_Mice);
    if (Prime !== undefined) fieldsToUpdate.push(`Prime = @Prime`) && request.input('Prime', sql.VarChar, Prime);
    if (Dispatched !== undefined) fieldsToUpdate.push(`Dispatched = @Dispatched`) && request.input('Dispatched', sql.VarChar, Dispatched);
    if (Labels !== undefined) fieldsToUpdate.push(`Labels = @Labels`) && request.input('Labels', sql.VarChar, Labels);
    if (Post_Code !== undefined) fieldsToUpdate.push(`Post_Code = @Post_Code`) && request.input('Post_Code', sql.VarChar, Post_Code);
    if (Disp_Date !== undefined) fieldsToUpdate.push(`Disp_Date = @Disp_Date`) && request.input('Disp_Date', sql.VarChar, Disp_Date);
    if (MU !== undefined) fieldsToUpdate.push(`MU = @MU`) && request.input('MU', sql.VarChar, MU);

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields to update provided." });
    }

    // Build final query
    const query = `
      UPDATE [February Order Sheet2]
      SET ${fieldsToUpdate.join(", ")}
      WHERE Order_No = @Order_No
    `;

    // Add the Order_No input separately
    request.input('Order_No', sql.VarChar, Order_No);

    // Execute query
    const result = await request.query(query);

    // ✅ Check if any row was actually updated
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "No order found with the provided Order_No." });
    }

    res.status(200).json({ success: true, message: "Order updated successfully." });

  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



const Get_Orders = async (req, res) => {
    try {
      await connectDB(); // Connect to the database
  
      const request = new sql.Request();
  
      const result = await request.query(`SELECT * FROM [February Order Sheet2]`);
  
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
  postAnOrder,
  Update_Order
  ,Get_Orders
};

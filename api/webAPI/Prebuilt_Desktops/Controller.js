const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");

const GetAllPrebuiltDesktops = async (req, res) => {
  try {
    await connectDB();

    const request = new sql.Request();
    const result = await request.query(`SELECT * FROM Prebuilt_Desktops`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No desktops found." });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching desktops:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const GetPrebuiltDesktopById = async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();

    const request = new sql.Request();
    const result = await request
      .input("Prebuilt_Desktops_ID", sql.Int, id)
      .query(`SELECT * FROM Prebuilt_Desktops WHERE Prebuilt_Desktops_ID = @Prebuilt_Desktops_ID`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Desktop not found." });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("Error fetching desktop:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const CreatePrebuiltDesktop = async (req, res) => {
  const {
    Prebuilt_ID,
    Built_By,
    Install_By,
    Item_Type,
    QTY,
    Model,
    Brand,
    SERIAL_NO,
    Processor,
    RAM,
    Hard_Drive,
    OS,
    PreB_Desk_Location,
  } = req.body;

  if (!Model || !Brand || !SERIAL_NO) {
    return res.status(400).json({ message: "Model, Brand and SERIAL_NO are required." });
  }

  try {
    await connectDB();

    const request = new sql.Request();
    await request
      .input("Prebuilt_ID", sql.Int, Prebuilt_ID)
      .input("Built_By", sql.VarChar, Built_By)
      .input("Install_By", sql.VarChar, Install_By)
      .input("Item_Type", sql.VarChar, Item_Type)
      .input("QTY", sql.Int, QTY)
      .input("Model", sql.VarChar, Model)
      .input("Brand", sql.VarChar, Brand)
      .input("SERIAL_NO", sql.VarChar, SERIAL_NO)
      .input("Processor", sql.VarChar, Processor)
      .input("RAM", sql.VarChar, RAM)
      .input("Hard_Drive", sql.VarChar, Hard_Drive)
      .input("OS", sql.VarChar, OS)
      .input("PreB_Desk_Location", sql.VarChar, PreB_Desk_Location)
      .query(`
        INSERT INTO Prebuilt_Desktops
          (Prebuilt_ID, Built_By, Install_By, Item_Type, QTY, Model, Brand, SERIAL_NO,
          Processor, RAM, Hard_Drive, OS, PreB_Desk_Location)
        VALUES
          (@Prebuilt_ID, @Built_By, @Install_By, @Item_Type, @QTY, @Model, @Brand, @SERIAL_NO,
          @Processor, @RAM, @Hard_Drive, @OS, @PreB_Desk_Location)
      `);

    res.status(201).json({ success: true, message: "Prebuilt desktop record created." });
  } catch (error) {
    console.error("Error creating desktop:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const UpdatePrebuiltDesktop = async (req, res) => {
  const { id } = req.params;
  const {
    Prebuilt_ID,
    Built_By,
    Install_By,
    Item_Type,
    QTY,
    Model,
    Brand,
    SERIAL_NO,
    Processor,
    RAM,
    Hard_Drive,
    OS,
    PreB_Desk_Location,
  } = req.body;

  try {
    await connectDB();

    const request = new sql.Request();
    const fieldsToUpdate = [];

    if (Prebuilt_ID !== undefined) {
      fieldsToUpdate.push("Prebuilt_ID = @Prebuilt_ID");
      request.input("Prebuilt_ID", sql.Int, Prebuilt_ID);
    }
    if (Built_By !== undefined) {
      fieldsToUpdate.push("Built_By = @Built_By");
      request.input("Built_By", sql.VarChar, Built_By);
    }
    if (Install_By !== undefined) {
      fieldsToUpdate.push("Install_By = @Install_By");
      request.input("Install_By", sql.VarChar, Install_By);
    }
    if (Item_Type !== undefined) {
      fieldsToUpdate.push("Item_Type = @Item_Type");
      request.input("Item_Type", sql.VarChar, Item_Type);
    }
    if (QTY !== undefined) {
      fieldsToUpdate.push("QTY = @QTY");
      request.input("QTY", sql.Int, QTY);
    }
    if (Model !== undefined) {
      fieldsToUpdate.push("Model = @Model");
      request.input("Model", sql.VarChar, Model);
    }
    if (Brand !== undefined) {
      fieldsToUpdate.push("Brand = @Brand");
      request.input("Brand", sql.VarChar, Brand);
    }
    if (SERIAL_NO !== undefined) {
      fieldsToUpdate.push("SERIAL_NO = @SERIAL_NO");
      request.input("SERIAL_NO", sql.VarChar, SERIAL_NO);
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
    if (OS !== undefined) {
      fieldsToUpdate.push("OS = @OS");
      request.input("OS", sql.VarChar, OS);
    }
    if (PreB_Desk_Location !== undefined) {
      fieldsToUpdate.push("PreB_Desk_Location = @PreB_Desk_Location");
      request.input("PreB_Desk_Location", sql.VarChar, PreB_Desk_Location);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    const query = `
      UPDATE Prebuilt_Desktops
      SET ${fieldsToUpdate.join(", ")}
      WHERE Prebuilt_Desktops_ID = @Prebuilt_Desktops_ID
    `;

    request.input("Prebuilt_Desktops_ID", sql.Int, id);

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Desktop not found." });
    }

    res.status(200).json({ success: true, message: "Desktop updated successfully." });
  } catch (error) {
    console.error("Error updating desktop:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const DeletePrebuiltDesktop = async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();

    const request = new sql.Request();
    const result = await request
      .input("Prebuilt_Desktops_ID", sql.Int, id)
      .query(`DELETE FROM Prebuilt_Desktops WHERE Prebuilt_Desktops_ID = @Prebuilt_Desktops_ID`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Desktop not found." });
    }

    res.status(200).json({ success: true, message: "Desktop deleted successfully." });
  } catch (error) {
    console.error("Error deleting desktop:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  GetAllPrebuiltDesktops,
  GetPrebuiltDesktopById,
  CreatePrebuiltDesktop,
  UpdatePrebuiltDesktop,
  DeletePrebuiltDesktop,
};

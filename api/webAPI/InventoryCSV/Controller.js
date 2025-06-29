const { connectDB } = require("../../SSMS_DB");
const sql = require("mssql");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// API to get inventory items with low stock (QTY_On_Hand < 6)
const GetLowStockItems = async (req, res) => {
  try {
    await connectDB();
    const request = new sql.Request();

    // You can query all tables, or just Inventory_AO for example.
    // Here's a combined query example for AO, Laptops, Desktops, Parts, Screens:
    // Return items from each table where QTY_On_Hand < 6, with some identifying columns.

    const query = `
      SELECT 'AO' AS InventoryType, Facility, Location_, Brand, Model, QTY_On_Hand
      FROM Inventory_AO WHERE QTY_On_Hand < 6
      UNION ALL
      SELECT 'Laptops', Facility, Location_, Brand, Model, QTY_On_Hand
      FROM Inventory_Laptops WHERE QTY_On_Hand < 6
      UNION ALL
      SELECT 'Desktops', Facility, Location_, Brand, Model, QTY_On_Hand
      FROM Inventory_Desktops WHERE QTY_On_Hand < 6
      UNION ALL
      SELECT 'Parts', Facility, Location_, Brand, Model, QTY_On_Hand
      FROM Inventory_Parts WHERE QTY_On_Hand < 6
      UNION ALL
      SELECT 'Screens', Facility, Location_, Brand, Model, QTY_On_Hand
      FROM Inventory_Screens WHERE QTY_On_Hand < 6
    `;

    const result = await request.query(query);

    res.status(200).json({
      success: true,
      lowStockItems: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const UploadInventoryCSV = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  const filePath = path.resolve(file.path);
  const rows = [];

  try {
    // Parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    await connectDB();

    const request = new sql.Request();

    for (const row of rows) {
      const tableType = determineTableType(row);
      if (!tableType) continue;

      const insertQuery = buildInsertQuery(tableType, row);
      if (!insertQuery) continue;

      const { query, inputs } = insertQuery;

      inputs.forEach(({ name, type, value }) => {
        request.input(name, type, value);
      });

      await request.query(query);
      request.parameters = {}; // reset for next
    }

    res
      .status(200)
      .json({ success: true, message: "CSV processed successfully" });
  } catch (err) {
    console.error("CSV Upload Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    fs.unlink(filePath, () => {}); // delete uploaded file
  }
};

// Determines the table a row belongs to
// function determineTableType(row) {
//   if (row.InventoryAO_ID) return "AIO";
//   if (row.Inventory_Laptops_ID) return "Laptops";
//   if (row.Inventory_Desktops_ID) return "Desktops";
//   if (row.Inventory_Parts_ID) return "Parts";
//   if (row.Inventory_Screens_ID) return "Screens";
//   return null;
// }

function determineTableType(row) {
  if (!row["Stock Type"]) return null;

  const stockType = row["Stock Type"].toLowerCase();

  if (stockType === "aio") return "AIO";
  if (stockType === "laptops") return "Laptops";
  if (stockType === "desktops") return "Desktops";
  if (stockType === "parts") return "Parts";
  if (stockType === "screens") return "Screens";

  return null; // Unknown type
}


function buildInsertQuery(table, row) {
  const sqlTypes = sql;

  switch (table) {
    case "AIO":
      return {
        query: `INSERT INTO Inventory_AO (
          Facility, Location_, Brand, Model, Screen_Size,
          Processor, RAM, Hard_Drive, Stand, QTY_Recieved, QTY_On_Hand
        ) VALUES (
          @Facility, @Location_, @Brand, @Model, @Screen_Size,
          @Processor, @RAM, @Hard_Drive, @Stand, @QTY_Recieved, @QTY_On_Hand
        )`,
        inputs: [
          { name: "Facility", type: sqlTypes.VarChar, value: row.Facility },
          { name: "Location_", type: sqlTypes.VarChar, value: row.Location_ },
          { name: "Brand", type: sqlTypes.VarChar, value: row.Brand },
          { name: "Model", type: sqlTypes.VarChar, value: row.Model },
          {
            name: "Screen_Size",
            type: sqlTypes.VarChar,
            value: row.Screen_Size,
          },
          { name: "Processor", type: sqlTypes.VarChar, value: row.Processor },
          { name: "RAM", type: sqlTypes.VarChar, value: row.RAM },
          { name: "Hard_Drive", type: sqlTypes.VarChar, value: row.Hard_Drive },
          { name: "Stand", type: sqlTypes.VarChar, value: row.Stand },
          {
            name: "QTY_Recieved",
            type: sqlTypes.Int,
            value: Number(row.QTY_Recieved),
          },
          {
            name: "QTY_On_Hand",
            type: sqlTypes.Int,
            value: Number(row.QTY_On_Hand),
          },
        ],
      };

    case "Laptops":
      return {
        query: `INSERT INTO Inventory_Laptops (
          Facility, Location_, Brand, Model, Desk_Type,
          Processor, RAM, Hard_Drive, Screen_Size, Resolution, QTY_Recieved, QTY_On_Hand
        ) VALUES (
          @Facility, @Location_, @Brand, @Model, @Desk_Type,
          @Processor, @RAM, @Hard_Drive, @Screen_Size, @Resolution, @QTY_Recieved, @QTY_On_Hand
        )`,
        inputs: [
          { name: "Facility", type: sqlTypes.VarChar, value: row.Facility },
          { name: "Location_", type: sqlTypes.VarChar, value: row.Location_ },
          { name: "Brand", type: sqlTypes.VarChar, value: row.Brand },
          { name: "Model", type: sqlTypes.VarChar, value: row.Model },
          { name: "Desk_Type", type: sqlTypes.VarChar, value: row.Desk_Type },
          { name: "Processor", type: sqlTypes.VarChar, value: row.Processor },
          { name: "RAM", type: sqlTypes.VarChar, value: row.RAM },
          { name: "Hard_Drive", type: sqlTypes.VarChar, value: row.Hard_Drive },
          {
            name: "Screen_Size",
            type: sqlTypes.VarChar,
            value: row.Screen_Size,
          },
          { name: "Resolution", type: sqlTypes.VarChar, value: row.Resolution },
          {
            name: "QTY_Recieved",
            type: sqlTypes.Int,
            value: Number(row.QTY_Recieved),
          },
          {
            name: "QTY_On_Hand",
            type: sqlTypes.Int,
            value: Number(row.QTY_On_Hand),
          },
        ],
      };

    case "Desktops":
      return {
        query: `INSERT INTO Inventory_Desktops (
          Facility, Location_, Brand, Model, Type_,
          Processor, RAM, Hard_Drive, QTY_Recieved, QTY_On_Hand
        ) VALUES (
          @Facility, @Location_, @Brand, @Model, @Type_,
          @Processor, @RAM, @Hard_Drive, @QTY_Recieved, @QTY_On_Hand
        )`,
        inputs: [
          { name: "Facility", type: sqlTypes.VarChar, value: row.Facility },
          { name: "Location_", type: sqlTypes.VarChar, value: row.Location_ },
          { name: "Brand", type: sqlTypes.VarChar, value: row.Brand },
          { name: "Model", type: sqlTypes.VarChar, value: row.Model },
          { name: "Type_", type: sqlTypes.VarChar, value: row.Type_ },
          { name: "Processor", type: sqlTypes.VarChar, value: row.Processor },
          { name: "RAM", type: sqlTypes.VarChar, value: row.RAM },
          { name: "Hard_Drive", type: sqlTypes.VarChar, value: row.Hard_Drive },
          {
            name: "QTY_Recieved",
            type: sqlTypes.Int,
            value: Number(row.QTY_Recieved),
          },
          {
            name: "QTY_On_Hand",
            type: sqlTypes.Int,
            value: Number(row.QTY_On_Hand),
          },
        ],
      };

    case "Parts":
      return {
        query: `INSERT INTO Inventory_Parts (
          Facility, Location_, Brand, Model, Type_,
          Comments, QTY_Recieved, QTY_On_Hand
        ) VALUES (
          @Facility, @Location_, @Brand, @Model, @Type_,
          @Comments, @QTY_Recieved, @QTY_On_Hand
        )`,
        inputs: [
          { name: "Facility", type: sqlTypes.VarChar, value: row.Facility },
          { name: "Location_", type: sqlTypes.VarChar, value: row.Location_ },
          { name: "Brand", type: sqlTypes.VarChar, value: row.Brand },
          { name: "Model", type: sqlTypes.VarChar, value: row.Model },
          { name: "Type_", type: sqlTypes.VarChar, value: row.Type_ },
          { name: "Comments", type: sqlTypes.VarChar, value: row.Comments },
          {
            name: "QTY_Recieved",
            type: sqlTypes.Int,
            value: Number(row.QTY_Recieved),
          },
          {
            name: "QTY_On_Hand",
            type: sqlTypes.Int,
            value: Number(row.QTY_On_Hand),
          },
        ],
      };

    case "Screens":
      return {
        query: `INSERT INTO Inventory_Screens (
          Facility, Location_, Brand, Model, Screen_Size,
          Ports_, Stand, QTY_Recieved, QTY_On_Hand
        ) VALUES (
          @Facility, @Location_, @Brand, @Model, @Screen_Size,
          @Ports_, @Stand, @QTY_Recieved, @QTY_On_Hand
        )`,
        inputs: [
          { name: "Facility", type: sqlTypes.VarChar, value: row.Facility },
          { name: "Location_", type: sqlTypes.VarChar, value: row.Location_ },
          { name: "Brand", type: sqlTypes.VarChar, value: row.Brand },
          { name: "Model", type: sqlTypes.VarChar, value: row.Model },
          {
            name: "Screen_Size",
            type: sqlTypes.VarChar,
            value: row.Screen_Size,
          },
          { name: "Ports_", type: sqlTypes.VarChar, value: row.Ports_ },
          { name: "Stand", type: sqlTypes.VarChar, value: row.Stand },
          {
            name: "QTY_Recieved",
            type: sqlTypes.Int,
            value: Number(row.QTY_Recieved),
          },
          {
            name: "QTY_On_Hand",
            type: sqlTypes.Int,
            value: Number(row.QTY_On_Hand),
          },
        ],
      };

    default:
      return null;
  }
}

module.exports = {
  UploadInventoryCSV,
  GetLowStockItems,
};

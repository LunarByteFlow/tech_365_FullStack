const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Enable Cross-Origin requests

// Import the database connection module
const { connectDB } = require("./SSMS_DB");
const sql = require("mssql/msnodesqlv8");
const app = express();
// const { postAnOrder, getAllOrders } =require('./webAPI/Order/Controller')
// const Router = express.Router();

const orderRouter = require("./webAPI/Order/Router.js");
const DispatchRouter = require("./webAPI/Dispatch/Router.js");
const Inventory_Order_Router = require("./webAPI/Inventory&Order/Router.js");
const Inventory_Order_Check_Router = require("./webAPI/Inventory-Check/Router.js");

const Returns_Router = require("./webAPI/Returns/Router.js");
const UserRouter = require("./webAPI/User/Router.js")
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api", orderRouter);
app.use("/api", DispatchRouter);
app.use("/api", Inventory_Order_Router);
app.use("/api", Inventory_Order_Check_Router);
app.use("/api", Returns_Router);
app.use("/api",UserRouter);

// Start server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Enable Cross-Origin requests

// Import the database connection module
const { connectDB } = require("./SSMS_DB");
const sql = require("mssql");
const app = express();
// const { postAnOrder, getAllOrders } =require('./webAPI/Order/Controller')
// const Router = express.Router();

const orderRouter = require("./webAPI/Order/Router.js");
const DispatchRouter = require("./webAPI/Dispatch/Router.js");
const Inventory_Order_Router = require("./webAPI/Inventory&Order/Router.js");
const Inventory_Order_Check_Router = require("./webAPI/Inventory-Check/Router.js");
const Returns_Router = require("./webAPI/Returns/Router.js");
const InventoryAO = require("./webAPI/InventoryAO/Router.js");
const InventoryDesktops = require("./webAPI/InventoryDesktops/Router.js");
const InventoryLaptops = require("./webAPI/InventoryLaptops/Router.js");
const InventoryScreens = require("./webAPI/InventoryScreens/Router.js");
const InventoryParts = require("./webAPI/InventoryParts/Router.js");
const UserRouter = require("./webAPI/User/Router.js");
const PrebuiltLaptops = require("./webAPI/Prebuilt_Laptops/Router.js");
const PrebuiltDesktops = require("./webAPI/Prebuilt_Desktops/Router.js");
const UploadInventoryCSVRouter = require("./webAPI/InventoryCSV/Router.js");
const ProductFinish = require("./webAPI/ProductFinish/Router.js");

// app.use(bodyParser.json());
app.use(express.json());
// app.use(cors());
const allowedOrigins = [
  "https://tech-365-full-stack.vercel.app/", // Your deployed frontend URL
  "http://localhost:3000", // Your local React development server URL
  "http://10.2.0.2",
  "http://localhost:5173", // Common for Vite React apps // Replace with your actual frontend URL
  //   // Add other allowed origins if needed (e.g., preview deployments)
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow requests from allowed origins or if origin is undefined (e.g., server-to-server)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Explicitly list allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly list allowed headers
  })
);

app.use("/api", orderRouter);
app.use("/api", DispatchRouter);
app.use("/api", Inventory_Order_Router);
app.use("/api", Inventory_Order_Check_Router);
app.use("/api", Returns_Router);
app.use("/api", UserRouter);
app.use("/api", InventoryAO);
app.use("/api", InventoryDesktops);
app.use("/api", InventoryLaptops);
app.use("/api", InventoryScreens);
app.use("/api", InventoryParts);
app.use("/api", PrebuiltLaptops);
app.use("/api", PrebuiltDesktops);
app.use("/api", UploadInventoryCSVRouter);
app.use("/api", ProductFinish);

// Initialize Database Connection (CRITICAL FOR VERCEL DEPLOYMENT)
let dbPool; // Declare a variable to hold the connection pool

async function initializeDbConnection() {
  try {
    dbPool = await connectDB(); // connectDB() returns the pool, or null/undefined if it just logs
    console.log("Database connection initialized.");
    // If connectDB() doesn't return the pool, and you need it elsewhere,
    // you might need to adjust SSMS_DB.js to always return the pool.
  } catch (err) {
    console.error("Error initializing database connection:", err);
    // On Vercel, this error will be visible in logs.
    // You might want to throw it to prevent the serverless function from initializing if DB connection is mandatory.
    // throw err;
  }
}

// Call the initialization function when the module is loaded (on Vercel cold start)
initializeDbConnection();

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running and listening on port ${PORT}`);
  });
}

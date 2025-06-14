// const express = require("express");
// const router = express.Router();
// const {UploadInventoryCSV} = require("./Controller"); // Path to your new controller file



// // Define routes for Desktop Inventory

// router.post("/UploadInventoryCSV/:id", UploadInventoryCSV); // DELETE a desktop item by ID

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer config: saves to `uploads/` directory
const upload = multer({
  dest: path.join(__dirname, "uploads")
});

const { UploadInventoryCSV,GetLowStockItems } = require("./Controller");

// Route to upload inventory CSV
router.post("/UploadInventoryCSV", upload.single("file"), UploadInventoryCSV);
router.get("/GetLowStockItems", upload.single("file"), GetLowStockItems);


module.exports = router;

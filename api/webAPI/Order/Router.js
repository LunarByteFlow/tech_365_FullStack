const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  postAnOrder,
  Update_Order,
  Get_Orders,
  Delete_OrderById,
  Get_SingleOrderById,
  Upload_CSV,
} = require("./Controller");

const Router = express.Router();
const uploadFolder = path.join(__dirname, "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer setup with CSV filter and file size limit (5MB)
const upload = multer({
  dest: uploadFolder,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed!"), false);
    }
  },
});

Router.post("/AddOrder", postAnOrder);
Router.put("/update_order", Update_Order);
Router.get("/Get_Orders", Get_Orders);
Router.delete("/Delete_OrderById/:id", Delete_OrderById);
Router.get("/Get_SingleOrderById/:id", Get_SingleOrderById);

// CSV Upload route with error handling for Multer
Router.post("/upload_csv", (req, res, next) => {
  upload.single("csvFile")(req, res, (err) => {
    if (err) {
      // Multer error occurred (file filter or size)
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, Upload_CSV);

module.exports = Router;

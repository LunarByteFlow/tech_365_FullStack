// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// // Multer config: saves to `uploads/` directory
// const upload = multer({
//   dest: path.join(__dirname, "uploads")
// });

// const { UploadInventoryCSV, GetLowStockItems } = require("./Controller");

// // Route to upload inventory CSV
// router.post("/UploadInventoryCSV", upload.single("file"), UploadInventoryCSV);

// // Route to get low stock items (no file upload required)
// router.get("/GetLowStockItems", GetLowStockItems);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.match(/\.csv$/)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  }
});

const { UploadInventoryCSV, GetLowStockItems } = require("./Controller");

// Route to upload inventory CSV with multer error handling
router.post("/UploadInventoryCSV", (req, res, next) => {
  upload.single("file")(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, UploadInventoryCSV);

// Route to get low stock items (no file upload required)
router.get("/GetLowStockItems", GetLowStockItems);

module.exports = router;

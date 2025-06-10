const express = require("express");
const router = express.Router();
const desktopInventoryController = require("./inventoryDesktopsController"); // Path to your new controller file

// Destructure the functions from the controller
const {
    Create_DesktopInventory,
    Get_AllDesktopInventory,
    Get_DesktopInventoryById,
    Update_DesktopInventory,
    Delete_DesktopInventory
} = desktopInventoryController;

// Define routes for Desktop Inventory
router.post("/Create_DesktopInventory", Create_DesktopInventory); // CREATE a new desktop item
router.get("/Get_AllDesktopInventory", Get_AllDesktopInventory);    // READ all desktop items
router.get("/Get_AllDesktopInventory/:id", Get_DesktopInventoryById); // READ a single desktop item by ID
router.put("/Update_DesktopInventory/:id", Update_DesktopInventory);  // UPDATE a desktop item by ID
router.delete("/Delete_DesktopInventory/:id", Delete_DesktopInventory); // DELETE a desktop item by ID

module.exports = router;
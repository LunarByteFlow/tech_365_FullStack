Create_PartInventory,
    Get_AllPartInventory,
    Get_PartInventoryById,
    Update_PartInventory,
    Delete_PartInventory

const express = require("express");
const router = express.Router();
const {Create_PartInventory,
    Get_AllPartInventory,
    Get_PartInventoryById,
    Update_PartInventory,
    Delete_PartInventory} = require("./Controller.js");

router.post("/Create_InventoryScreen", Create_InventoryScreen);
router.get("/Get_AllInventoryScreens", Get_AllInventoryScreens);
router.get("/Get_InventoryScreenById/:id", Get_InventoryScreenById);
router.put("/Update_InventoryScreen/:id", Update_InventoryScreen);
router.delete("/Delete_InventoryScreen/:id", Delete_InventoryScreen);

module.exports = router;

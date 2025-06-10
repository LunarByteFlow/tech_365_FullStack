
const express = require("express");
const router = express.Router();
const {Create_PartInventory,
    Get_AllPartInventory,
    Get_PartInventoryById,
    Update_PartInventory,
    Delete_PartInventory} = require("./Controller.js");

router.post("/Create_PartInventory", Create_PartInventory);
router.get("/Get_AllPartInventory", Get_AllPartInventory);
router.get("/Get_PartInventoryById/:id", Get_PartInventoryById);
router.put("/Update_PartInventory", Update_PartInventory);
router.delete("/Delete_PartInventory/:id", Delete_PartInventory);

module.exports = router;

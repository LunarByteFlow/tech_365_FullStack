const express = require("express");
const router = express.Router();
const {Create_LaptopInventory,
    Get_AllLaptopInventory,
    Get_LaptopInventoryById,
    Update_LaptopInventory,
    Delete_LaptopInventory} = require("./Controller.js");

router.post("/Create_LaptopInventory", Create_LaptopInventory);
router.get("/Get_AllLaptopInventory", Get_AllLaptopInventory);
router.get("/Get_LaptopInventoryById/:id", Get_LaptopInventoryById);
router.put("/Update_LaptopInventory/:id", Update_LaptopInventory);
router.delete("/Delete_LaptopInventory/:id", Delete_LaptopInventory);

module.exports = router;

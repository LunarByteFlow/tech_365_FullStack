const express = require("express");
const router = express.Router();
const {
  Create_InventoryScreen,
  Get_AllInventoryScreens,
  Get_InventoryScreenById,
  Update_InventoryScreen,
  Delete_InventoryScreen,
} = require("./Controller.js");

router.post("/Create_InventoryScreen", Create_InventoryScreen);
router.get("/Get_AllInventoryScreens", Get_AllInventoryScreens);
router.get("/Get_InventoryScreenById/:id", Get_InventoryScreenById);
router.put("/Update_InventoryScreen/:id", Update_InventoryScreen);
router.delete("/Delete_InventoryScreen/:id", Delete_InventoryScreen);

module.exports = router;

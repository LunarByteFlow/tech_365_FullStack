const express = require("express");
const router = express.Router();
const {Create_Inventory,Get_Inventory,Update_Inventory,Delete_Inventory} = require("./Controller.js");

router.post("/Create_Inventory", Create_Inventory);
router.get("/Get_Inventory", Get_Inventory);
router.put("/Update_Inventory/:id", Update_Inventory);
router.delete("/Delete_Inventory/:id", Delete_Inventory);

module.exports = router;

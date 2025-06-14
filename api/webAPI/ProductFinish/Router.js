const express = require("express");
const {
  GetAllProductFinishes,
  GetProductFinishById,
  CreateProductFinish,
  UpdateProductFinish,
  DeleteProductFinish,
  Get5ProductFinishesFields,
} = require("./Controller");
const router = express.Router();
router.get("/GetAllProductFinishes", GetAllProductFinishes);
router.get("/Get5ProductFinishesFields", Get5ProductFinishesFields);
router.get("/GetProductFinishById/:id", GetProductFinishById);
router.post("/CreateProductFinish", CreateProductFinish);
router.put("/UpdateProductFinish/:id", UpdateProductFinish);
router.delete("/DeleteProductFinish/:id", DeleteProductFinish);
module.exports = router;
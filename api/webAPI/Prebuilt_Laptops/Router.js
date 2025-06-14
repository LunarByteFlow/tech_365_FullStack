
  const express = require("express");
  const {
    GetAllPrebuiltLaptops,
  GetPrebuiltLaptopById,
  CreatePrebuiltLaptop,
  UpdatePrebuiltLaptop,
  DeletePrebuiltLaptop
  } = require("./Controller");
  
  const router = express.Router();
  
  router.get("/GetAllPrebuiltLaptops", GetAllPrebuiltLaptops);
  router.get("/GetPrebuiltLaptopById/:id", GetPrebuiltLaptopById);
  router.post("/CreatePrebuiltLaptop", CreatePrebuiltLaptop);
  router.put("/UpdatePrebuiltLaptop/:id", UpdatePrebuiltLaptop);
  router.delete("/DeletePrebuiltLaptop/:id", DeletePrebuiltLaptop);
  
  module.exports = router;
  
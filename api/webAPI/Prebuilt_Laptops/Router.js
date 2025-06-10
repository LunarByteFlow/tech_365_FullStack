
  const express = require("express");
  const {
    GetAllPrebuiltLaptops,
  GetPrebuiltLaptopById,
  CreatePrebuiltLaptop,
  UpdatePrebuiltLaptop,
  DeletePrebuiltLaptop
  } = require("./Controller");
  
  const router = express.Router();
  
  router.get("/GetAllPrebuiltDesktops", GetAllPrebuiltLaptops);
  router.get("/GetPrebuiltDesktopById/:id", GetPrebuiltLaptopById);
  router.post("/CreatePrebuiltDesktop", CreatePrebuiltLaptop);
  router.put("/UpdatePrebuiltDesktop/:id", UpdatePrebuiltLaptop);
  router.delete("/DeletePrebuiltDesktop/:id", DeletePrebuiltLaptop);
  
  module.exports = router;
  
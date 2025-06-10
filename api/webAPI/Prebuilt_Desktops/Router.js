const express = require("express");
const {
  GetAllPrebuiltDesktops,
  GetPrebuiltDesktopById,
  CreatePrebuiltDesktop,
  UpdatePrebuiltDesktop,
  DeletePrebuiltDesktop,
} = require("./Controller");

const router = express.Router();

router.get("/GetAllPrebuiltDesktops", GetAllPrebuiltDesktops);
router.get("/GetPrebuiltDesktopById/:id", GetPrebuiltDesktopById);
router.post("/CreatePrebuiltDesktop", CreatePrebuiltDesktop);
router.put("/UpdatePrebuiltDesktop/:id", UpdatePrebuiltDesktop);
router.delete("/DeletePrebuiltDesktop/:id", DeletePrebuiltDesktop);

module.exports = router;

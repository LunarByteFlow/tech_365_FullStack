const express = require("express");
const { Get_Inventory_Check} = require("./Controller");
const Router = express.Router();

Router.get("/Get_Inventory_Check", Get_Inventory_Check);
// Router.get("/GetAllOrders",GetAllOrders);
module.exports = Router;

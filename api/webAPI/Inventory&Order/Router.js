const express = require("express");
const { Get_Inventory_Order} = require("./Controller");
const Router = express.Router();

Router.get("/Get_Inventory_Order", Get_Inventory_Order);
// Router.get("/GetAllOrders",GetAllOrders);
module.exports = Router;
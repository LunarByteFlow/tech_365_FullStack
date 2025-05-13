const express = require("express");
const { Get_Inventory_Order,getLowStockItems} = require("./Controller");
const Router = express.Router();

Router.get("/Get_Inventory_Order", Get_Inventory_Order);
Router.get("/low-stock-items",getLowStockItems);
// Router.get("/GetAllOrders",GetAllOrders);
module.exports = Router;
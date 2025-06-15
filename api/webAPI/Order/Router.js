const express = require("express");
const {
  postAnOrder,
  Update_Order,
  Get_Orders,
  Delete_OrderById,
  Get_SingleOrderById,
} = require("./Controller");
const Router = express.Router();

Router.post("/AddOrder", postAnOrder);
Router.put("/update_order", Update_Order);
Router.get("/Get_Orders", Get_Orders);
Router.delete("/Delete_OrderById/:id", Delete_OrderById);
Router.get("/Get_SingleOrderById/:id", Get_SingleOrderById);

Delete_OrderById, Get_SingleOrderById;
// Router.get("/Get_CombinedOrders",Get_CombinedOrders);

module.exports = Router;

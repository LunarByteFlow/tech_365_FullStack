const express = require("express");
const { postAnOrder,Update_Order,Get_Orders,Get_CombinedOrders} = require("./Controller");
const Router = express.Router();

Router.post("/AddOrder", postAnOrder);
Router.patch("/update_order", Update_Order);
Router.get("/Get_Orders",Get_Orders);
Router.get("/Get_CombinedOrders",Get_CombinedOrders);

module.exports = Router;

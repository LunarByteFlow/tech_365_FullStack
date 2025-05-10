const express = require("express");
const { Get_Returns} = require("./Controller");
const Router = express.Router();

Router.get("/Get_Returns", Get_Returns);
// Router.get("/GetAllOrders",GetAllOrders);
module.exports = Router;

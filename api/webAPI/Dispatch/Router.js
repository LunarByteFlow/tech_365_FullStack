const express = require("express");
const { Post_Dispatch,Update_Dispatch,Get_Dispatch} = require("./Controller");
const Router = express.Router();

Router.post("/AddDispatch", Post_Dispatch);
Router.patch("/Update_Dispatch", Update_Dispatch);
Router.get("/Get_Dispatch", Get_Dispatch);


// Router.get("/GetAllOrders",GetAllOrders);
module.exports = Router;

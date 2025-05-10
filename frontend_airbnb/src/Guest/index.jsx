import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import UserLoginPage from "./components/UserLoginPage.js";
import Navbar from "./components/GuestNavbar.js";
import Chatbot from "./components/Chatbot";
import Admin from "../Admin/index.js";
import User from "../User/index.js";
import ContactUs from "./pages/ContactUs";

import RegisterUser from "../Admin/components/RegisterUser.js";

import AddNewOrder from "./pages/AddNewOrder";
import DisplayDispatch from "./pages/DisplayDispatch.jsx";
import DisplayOrders from "./pages/DisplayOrders.jsx";
import DisplayInventoryCheck from "./pages/DisplayInventoryCheck.jsx";
import DisplayInventoryOrder from "./pages/DisplayInventoryOrder.jsx";
import UpdateOrderForm from "./pages/UpdateOrderForm";
import GuestHome from "./pages/GuestHome";
import UserHome from "../User/components/UserHome.js";
import AdminHome from "../Admin/components/AdminHome.jsx";
export default function Guest() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/AddOrder" element={<AddNewOrder />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/Get_Dispatch" element={<DisplayDispatch />}></Route>
        <Route path="/Get_Orders" element={<DisplayOrders />}></Route>
        <Route
          path="/Get_Inventory_Check"
          element={<DisplayInventoryCheck />}
        ></Route>
        <Route
          path="/Get_Inventory_Order"
          element={<DisplayInventoryOrder />}
        ></Route>
        <Route path="/update_order" element={<UpdateOrderForm />}></Route> 
        <Route path="/admin/home" element={<AdminHome />}></Route>
        <Route path="/user/home" element={<UserHome />}></Route>
      </Routes>
    </>
  );
}

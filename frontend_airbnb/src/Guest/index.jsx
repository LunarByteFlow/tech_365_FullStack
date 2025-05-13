import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLoginPage from "./components/UserLoginPage.jsx";
import Navbar from "./components/GuestNavbar.jsx";
import Admin from "../Admin/index.js";
import User from "../User/index.js";
import RegisterUser from "../Admin/components/RegisterUser.jsx";
import AddNewOrder from "./pages/AddNewOrder";
import DisplayDispatch from "./pages/DisplayDispatch.jsx";
import DisplayOrders from "./pages/DisplayOrders.jsx";
import DisplayInventoryCheck from "./pages/DisplayInventoryCheck.jsx";
import DisplayInventoryOrder from "./pages/DisplayInventoryOrder.jsx";
import UpdateOrderForm from "./pages/UpdateOrderForm.jsx";
import GuestHome from "./pages/GuestHome";
import UserHome from "../User/components/UserHome.jsx";
import AdminHome from "../Admin/components/AdminHome.jsx";
export default function Guest() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user/*" element={<User />} />

        <Route path="/" element={<GuestHome />} />
        <Route path="/AddOrder" element={<AddNewOrder />} />
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
        <Route path="/admin" element={<AdminHome />}></Route>
        <Route path="/user" element={<UserHome />}></Route>
      </Routes>
    </>
  );
}

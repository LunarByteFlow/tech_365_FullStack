import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLoginPage from "./components/UserLoginPage.jsx";
import Navbar from "./components/GuestNavbar.jsx";
import Admin from "../Admin/index.js";
import RegisterUser from "../Admin/components/RegisterUser.jsx";
import AddNewOrder from "./pages/AddNewOrder";
import DisplayDispatch from "./pages/DisplayDispatch.jsx";
import DisplayOrders from "./pages/DisplayOrders.jsx";
import DisplayInventoryCheck from "./pages/DisplayInventoryCheck.jsx";
import DisplayInventoryOrder from "./pages/DisplayInventoryOrder.jsx";
import UpdateOrderForm from "./pages/UpdateOrderForm.jsx";
import GuestHome from "./pages/GuestHome";
import AdminHome from "../Admin/components/AdminHome.jsx";
import GuestNavbar from "../Guest/components/GuestNavbar.jsx";
import Footer from "./pages/Footer.jsx";
import InventoryHome from "../Inventory/components/InventoryHome.jsx";
import ProductFinishHome from "../ProductFinish/components/ProductFinishHome.jsx";
import Inventory from "../Inventory/index.js";
import Technician from "../Technician/index.js";
import ProductFinish from "../ProductFinish/index.js";
import TechnicianHome from "../Technician/components/TechnicianHome.jsx"
export default function Guest() {
  return (
    <>
      <GuestNavbar />

      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/inventory/*" element={<Inventory />} />
        <Route path="/technician/*" element={<Technician />} />
        <Route path="/product_finish/*" element={<ProductFinish />} />
        <Route path="/" element={<GuestHome />} />
        <Route path="/AddOrder" element={<AddNewOrder />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
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
        <Route path="/technician" element={<TechnicianHome />}></Route>
        <Route path="/product_finish" element={<ProductFinishHome />}></Route>
        <Route path="/inventory" element={<InventoryHome />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

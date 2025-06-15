// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import InventoryNavbar from "./InventoryNavbar";
import TechnicianNavbar from "./TechnicianNavbar";
import ProductFinishNavbar from "./ProductFinishNavbar"
const InventoryLayout = () => {
  return (
    <>
      <ProductFinishNavbar/>
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default InventoryLayout;

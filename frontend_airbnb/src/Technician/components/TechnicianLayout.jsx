// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import InventoryNavbar from "./InventoryNavbar";
import TechnicianNavbar from "./TechnicianNavbar";
const InventoryLayout = () => {
  return (
    <>
      <TechnicianNavbar />
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default InventoryLayout;

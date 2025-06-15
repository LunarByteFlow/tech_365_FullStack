// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import InventoryNavbar from "./InventoryNavbar";
const InventoryLayout = () => {
  return (
    <>
      <InventoryNavbar />
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default InventoryLayout;

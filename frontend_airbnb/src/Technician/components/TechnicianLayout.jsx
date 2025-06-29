// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TechnicianNavbar from "./TechnicianNavbar";
const TechnicianLayout = () => {
  return (
    <>
      <TechnicianNavbar />
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default TechnicianLayout;

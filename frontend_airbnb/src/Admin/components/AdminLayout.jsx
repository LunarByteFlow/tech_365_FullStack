// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;

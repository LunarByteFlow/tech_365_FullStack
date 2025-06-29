// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ProductFinishNavbar from "./ProductFinishNavbar"
const ProductFinishLayout = () => {
  return (
    <>
      <ProductFinishNavbar/>
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default ProductFinishLayout;

import React from "react";
import CustomForm from "../components/CustomForm/CustomLogin";
// import Footer from "../../User/components/Footer";
import Footer from "./Footer";

export default function LoginPage() {
  return (
    <>
      <div
        style={{
          height: "90vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomForm />
      </div>
      <Footer />
    </>
  );
}

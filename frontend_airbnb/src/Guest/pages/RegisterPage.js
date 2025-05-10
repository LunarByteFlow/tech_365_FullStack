import React from "react";
import CustomForm from "../components/CustomForm/CustomLogin";
// import Footer from "../../User/components/Footer";
import Footer from "./Footer";
// import RegisterUser from "../components/CustomForm/RegisterUser";
export default function RegisterPage() {
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

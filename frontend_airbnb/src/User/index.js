//import routing
import { Route, Routes } from "react-router-dom";

// import Navbar from "../Guest/components/Navbar";
import UserNavbar from "./components/UserNavbar";
import UserLoginPage from "../Guest/components/UserLoginPage";
import RegisterUser from "../Guest/pages/RegisterPage";

import UserProfile from "./components/UserProfile";
import AddNewPlace from "../Guest/pages/AddNewOrder";
import AdminHome from "../Admin/components/AdminHome";
import AddNewOrder from "../Guest/pages/AddNewOrder";
export default function User() {
  return (
    <>
      <UserNavbar />
      <Routes>
        <Route exact path="/" element={<AdminHome />}></Route>
        <Route exact path="/postAnOrder" element={<AddNewOrder />}></Route>
        <Route path="/admin/home" element={<AdminHome />}></Route>
      </Routes>
    </>
  );
}

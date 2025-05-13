//import routing
import { Route, Routes } from "react-router-dom";
import AdminHome from "../Admin/components/AdminHome";
import AddNewOrder from "../Guest/pages/AddNewOrder";
export default function User() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<AdminHome />}></Route>
        <Route exact path="/postAnOrder" element={<AddNewOrder />}></Route>
        <Route path="/admin/home" element={<AdminHome />}></Route>
      </Routes>
    </>
  );
}

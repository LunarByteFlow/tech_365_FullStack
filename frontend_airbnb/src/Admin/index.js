//import routing
import { Route, Routes } from "react-router-dom";

// import Navbar from "../Guest/components/Navbar";
import UserProfile from "./components/UserProfile";
import AddNewPlace from "../Guest/pages/AddNewOrder";
import AdminHome from "./components/AdminHome";
import UserHome from "../User/components/UserHome";
import AdminNavbar from "./components/AdminNavbar";

export default function Admin() {
  return (
    <>
      <AdminNavbar/>
      <Routes>
        <Route
          exact
          path="/admin/home"
          element={
            <>
              <AdminHome />
            </>
          }
        ></Route>

        <Route
          exact
          path="/postAnAdd"
          element={
            <>
              <AddNewPlace />
            </>
          }
        ></Route>
        <Route path="/user/home" element={<UserHome />}></Route>
        <Route path="/admin/home" element={<AdminHome />}></Route>
      </Routes>
    </>
  );
}

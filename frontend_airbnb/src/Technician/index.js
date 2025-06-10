//import routing
import { Route, Routes } from "react-router-dom";
import AddNewOrder from "../Guest/pages/AddNewOrder";
import UserHome from "./components/UserHome";
import DisplayDispatch from "../Guest/pages/DisplayDispatch";
import DisplayOrders from "../Guest/pages/DisplayOrders";
import DisplayInventoryCheck from "../Guest/pages/DisplayInventoryCheck";
import DisplayInventoryOrder from "../Guest/pages/DisplayInventoryOrder";
import UpdateOrderForm from "../Guest/pages/UpdateOrderForm";
export default function User() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="*" element={<UserHome />} />
        <Route path="user" element={<UserHome />} />
        <Route path="Get_Dispatch" element={<DisplayDispatch />} />
        <Route path="Get_Orders" element={<DisplayOrders />} />
        <Route path="Get_Inventory_Check" element={<DisplayInventoryCheck />} />
        <Route path="Get_Inventory_Order" element={<DisplayInventoryOrder />} />
        <Route path="update_order" element={<UpdateOrderForm />} />
        <Route path="AddOrder" element={<AddNewOrder />} />
      </Routes>
      
    </>
  );
}

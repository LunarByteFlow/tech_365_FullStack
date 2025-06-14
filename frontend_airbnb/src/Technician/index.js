//import routing
import { Route, Routes } from "react-router-dom";
import AddNewOrder from "../Guest/pages/AddNewOrder";
import TechnicianHome from "./components/TechnicianHome";
import DisplayDispatch from "../Guest/pages/DisplayDispatch";
import DisplayOrders from "../Guest/pages/DisplayOrders";
import DisplayInventoryCheck from "../Guest/pages/DisplayInventoryCheck";
import DisplayInventoryOrder from "../Guest/pages/DisplayInventoryOrder";
import UpdateOrderForm from "../Guest/pages/UpdateOrderForm";
import LaptopPrebuilt from "../Inventory/components/LaptopPrebuilt";
import DesktopPrebuilt from "../Inventory/components/DesktopPrebuilt";
export default function Technician() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TechnicianHome />} />
        <Route path="*" element={<TechnicianHome />} />
        <Route path="technician" element={<TechnicianHome />} />
        <Route path="Get_Dispatch" element={<DisplayDispatch />} />
        <Route path="Get_Orders" element={<DisplayOrders />} />
        <Route path="Get_Inventory_Check" element={<DisplayInventoryCheck />} />
        <Route path="Get_Inventory_Order" element={<DisplayInventoryOrder />} />
        <Route path="update_order" element={<UpdateOrderForm />} />
        <Route path="AddOrder" element={<AddNewOrder />} />
        <Route path="Laptop Prebuilt" element={<LaptopPrebuilt />} />
        <Route path="Desktop Prebuilt" element={<DesktopPrebuilt />} />
      </Routes>
      
    </>
  );
}

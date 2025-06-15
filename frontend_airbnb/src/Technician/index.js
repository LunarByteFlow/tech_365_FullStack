//import routing
import { Route, Routes } from "react-router-dom";
import AddNewOrder from "../Guest/pages/AddNewOrder";
import TechnicianHome from "./components/TechnicianHome";
import DisplayDispatch from "../Guest/pages/DisplayDispatch";
import DisplayOrders from "../Guest/pages/DisplayOrders";
import DisplayInventoryCheck from "../Guest/pages/DisplayInventoryCheck";
import DisplayInventoryOrder from "../Guest/pages/DisplayInventoryOrder";
import UpdateOrderForm from "../Guest/pages/UpdateOrderForm";
import TechnicianLayout from "./components/TechnicianLayout";
import LaptopPrebuilt from "../Inventory/components/LaptopPrebuilt";
import DesktopPrebuilt from "../Inventory/components/DesktopPrebuilt";
export default function Technician() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TechnicianLayout />}>
          <Route index element={<TechnicianHome />} />
          {/* <Route path="technician" element={<TechnicianHome />} /> */}
          <Route path="Get_Dispatch" element={<DisplayDispatch />} />
          <Route path="Get_Orders" element={<DisplayOrders />} />
          <Route path="laptop_prebuilt" element={<LaptopPrebuilt />} />
          <Route path="desktop_prebuilt" element={<DesktopPrebuilt />} />
          <Route path="AddOrder" element={<AddNewOrder />} />
          <Route
            path="Get_Inventory_Check"
            element={<DisplayInventoryCheck />}
          />
          <Route
            path="Get_Inventory_Order"
            element={<DisplayInventoryOrder />}
          />
          <Route path="*" element={<TechnicianHome />} />
        </Route>
      </Routes>
    </>
  );
}

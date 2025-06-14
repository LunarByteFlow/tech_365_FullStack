//import routing
import { Route, Routes } from "react-router-dom";
import AddNewOrder from "../Guest/pages/AddNewOrder";
import InventoryHome from "./components/InventoryHome";
import DisplayDispatch from "../Guest/pages/DisplayDispatch";
import DisplayOrders from "../Guest/pages/DisplayOrders";
import DisplayInventoryCheck from "../Guest/pages/DisplayInventoryCheck";
import DisplayInventoryOrder from "../Guest/pages/DisplayInventoryOrder";
import UpdateOrderForm from "../Guest/pages/UpdateOrderForm";
import InventoryLaptop from "./components/InventoryLaptop";
import InventoryDesktops from "./components/InventoryDesktops";
import InventoryAO from "./components/InventoryAO";
import InventoryParts from "./components/InventoryParts";
import LaptopPrebuilt from "./components/LaptopPrebuilt";
import DesktopPrebuilt from "./components/DesktopPrebuilt";
export default function Inventory() {
  return (
    <>
      <Routes>
        <Route path="/" element={<InventoryHome />} />
        <Route path="*" element={<InventoryHome />} />
        <Route path="inventory" element={<InventoryHome />} />
        <Route path="Get_Dispatch" element={<DisplayDispatch />} />
        <Route path="Get_Orders" element={<DisplayOrders />} />
        <Route path="Get_Inventory_Check" element={<DisplayInventoryCheck />} />
        <Route path="Get_Inventory_Order" element={<DisplayInventoryOrder />} />
        <Route path="Inventory_Laptops" element={<InventoryLaptop />} />
        <Route path="Inventory_Desktops" element={<InventoryDesktops />} />
        <Route path="Inventory_AO" element={<InventoryAO />} />
        <Route path="Inventory_Parts" element={<InventoryParts />} />
        <Route path="Laptop Prebuilt" element={<LaptopPrebuilt />} />
        <Route path="Desktop Prebuilt" element={<DesktopPrebuilt />} />

      </Routes>
      
    </>
  );
}

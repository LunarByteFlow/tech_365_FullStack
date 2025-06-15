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
import InventoryScreen from "./components/InventoryScreens";
import InventoryLayout from "./components/InventoryLayout";
export default function Inventory() {
  return (
    <>
      {/* <Routes>
        <Route path="/" element={<InventoryHome />} />
        <Route path="*" element={<InventoryHome />} />
        <Route path="inventory" element={<InventoryHome />} />
        <Route path="Get_Dispatch" element={<DisplayDispatch />} />
        <Route path="Get_Orders" element={<DisplayOrders />} />
        <Route path="Inventory_Laptops" element={<InventoryLaptop />} />
        <Route path="Inventory_Desktops" element={<InventoryDesktops />} />
        <Route path="Inventory_AO" element={<InventoryAO />} />
        <Route path="Inventory_Parts" element={<InventoryParts />} />
        <Route path="Laptop_Prebuilt" element={<LaptopPrebuilt />} />
        <Route path="Desktop_Prebuilt" element={<DesktopPrebuilt />} />
        <Route path="Inventory_Screens" element={<InventoryScreen />} />
        <Route path="Inventory_Parts" element={<InventoryParts />} />


      </Routes> */}
      <Routes>
        <Route path="/" element={<InventoryLayout />}>
          <Route index element={<InventoryHome />} />
          <Route path="inventory" element={<InventoryHome />} />
          <Route path="Get_Dispatch" element={<DisplayDispatch />} />
          <Route path="Get_Orders" element={<DisplayOrders />} />
          <Route path="Inventory_Laptops" element={<InventoryLaptop />} />
          <Route path="Inventory_Desktops" element={<InventoryDesktops />} />
          <Route path="Inventory_AO" element={<InventoryAO />} />
          <Route path="Inventory_Parts" element={<InventoryParts />} />
          <Route path="Laptop_Prebuilt" element={<LaptopPrebuilt />} />
          <Route path="Desktop_Prebuilt" element={<DesktopPrebuilt />} />
          <Route path="Inventory_Screens" element={<InventoryScreen />} />
          <Route path="*" element={<InventoryHome />} />
        </Route>
      </Routes>
    </>
  );
}

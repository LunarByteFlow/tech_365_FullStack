//import routing
import { Route, Routes } from "react-router-dom";
import AdminHome from "./components/AdminHome";
import LowStockTable from "./components/LowStockTable";
import UpdateOrderForm from "../Guest/pages/UpdateOrderForm";
import DisplayInventoryCheck from "../Guest/pages/DisplayInventoryCheck";
import DisplayInventoryOrder from "../Guest/pages/DisplayInventoryOrder";
import DisplayOrders from "../Guest/pages/DisplayOrders";
import DisplayDispatch from "../Guest/pages/DisplayDispatch";
import AddNewOrder from "../Guest/pages/AddNewOrder.jsx";
import DownloadCSV from "./components/DownloadCSV.jsx";
import PrebuiltLaptops from "./components/PrebuiltLaptops.jsx";
import PrebuiltDesktops from "./components/PrebuiltDesktops.jsx";
import InventoryLaptop from "./components/InventoryLaptop.jsx";
import InventoryDesktops from "../Inventory/components/InventoryDesktops.jsx";
import InventoryParts from "./components/InventoryParts.jsx";
import InventoryAO from "../Inventory/components/InventoryAO.jsx";
import OrderReturns from "./components/OrderReturns.jsx";
import InventoryUploader from "./components/InventoryUploader.jsx";
import CombinedOrders from "./components/CombinedOrders.jsx";
import RegisterUser from "./components/RegisterUser.jsx";
export default function Admin() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="*" element={<AdminHome />} />
        <Route path="admin" element={<AdminHome />} />
        <Route path="low-stock" element={<LowStockTable />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="Get_Orders" element={<DisplayOrders />} />
        <Route path="update_order" element={<UpdateOrderForm />} />
        <Route path="AddOrder" element={<AddNewOrder />} />
        <Route path="download_csv" element={<DownloadCSV />} />
        <Route path="order_returns" element={<OrderReturns />} />
        <Route path="prebuilt_laptops" element={<PrebuiltLaptops />} />
        <Route path="prebuilt_desktops" element={<PrebuiltDesktops />} />
        <Route path="inventory_laptops" element={<InventoryLaptop />} />
        <Route path="inventory_desktops" element={<InventoryDesktops />} />
        <Route path="inventory_AO" element={<InventoryAO />} />
        <Route path="inventory_parts" element={<InventoryParts />} />
        <Route path="InventoryUploader" element={<InventoryUploader />} />
        <Route path="CombinedOrders" element={<CombinedOrders />} />
      </Routes>
    </>
  );
}

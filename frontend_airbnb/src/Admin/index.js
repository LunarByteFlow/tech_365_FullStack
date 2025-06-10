//import routing
import { Route, Routes } from "react-router-dom";
import AdminHome from "./components/AdminHome";
import LowStockTable from "./components/LowStockTable";
import UpdateOrderForm from "../Guest/pages/UpdateOrderForm";
import DisplayInventoryCheck from "../Guest/pages/DisplayInventoryCheck";
import DisplayInventoryOrder from "../Guest/pages/DisplayInventoryOrder";
import DisplayOrders from "../Guest/pages/DisplayOrders";
import DisplayDispatch from "../Guest/pages/DisplayDispatch";
import AddNewOrder from "../Guest/pages/AddNewOrder.jsx"
import DownloadCSV from "./components/DownloadCSV.jsx";

export default function Admin() {
  return (
    <>
      <Routes>
        
      <Route path="/" element={<AdminHome />} />
      <Route path="*" element={<AdminHome />} />
      <Route path="admin" element={<AdminHome />} />
      <Route path="low-stock" element={<LowStockTable />} />
      <Route path="Get_Dispatch" element={<DisplayDispatch />} />
      <Route path="Get_Orders" element={<DisplayOrders />} />
      <Route path="Get_Inventory_Check" element={<DisplayInventoryCheck />} />
      <Route path="Get_Inventory_Order" element={<DisplayInventoryOrder />} />
      <Route path="update_order" element={<UpdateOrderForm />} />
      <Route path="AddOrder" element={<AddNewOrder />} />
      <Route path="download_csv" element={<DownloadCSV />} />
    </Routes>
    </>
  );
}


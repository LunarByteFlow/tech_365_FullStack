import { useEffect, useState } from "react";
import { supabase } from "../supabase/SupabaseClient";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { ShoppingCart, RotateCcw, Package, TrendingUp, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: ordersData } = await supabase.from("OrderSheet").select("*");
      const { data: returnsData } = await supabase.from("Order returns").select("*");

      const inventoryTables = [
        "Inventory_Laptops", "Inventory_Desktops",
        "Inventory_Screens", "Inventory_Parts",
        "Inventory_AIO", "Prebuilt_Laptops", "Prebuilt_Desktops"
      ];
      let combinedInventory = [];
      for (const table of inventoryTables) {
        const { data } = await supabase.from(table).select("*");
        if (data) combinedInventory = [...combinedInventory, ...data];
      }

      setOrders(ordersData || []);
      setReturns(returnsData || []);
      setInventory(combinedInventory);
    };
    fetchData();
  }, []);

  // KPI calculations
  const totalOrders = orders.length;
  const totalReturns = returns.length;
  const totalInventory = inventory.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.Price || 0) * (o.QTY || 0), 0);
  const lowInventory = inventory.filter(i => i.Stock < 5);

  // Charts data
  const ordersByType = Object.values(
    orders.reduce((acc, o) => {
      acc[o.ItemType] = acc[o.ItemType] || { type: o.ItemType, count: 0 };
      acc[o.ItemType].count += 1;
      return acc;
    }, {})
  );

  const ordersByBrand = Object.values(
    orders.reduce((acc, o) => {
      acc[o.Brand] = acc[o.Brand] || { brand: o.Brand, count: 0 };
      acc[o.Brand].count += 1;
      return acc;
    }, {})
  );

  const ordersTrend = orders.map(o => ({ date: o.OrderDate, qty: o.QTY }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D72638", "#6A0572"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Tech 365 Analytics</h2>
        <nav className="space-y-3">
          <MenuItem icon="📊" text="Dashboard" active />
          <MenuItem icon="🛒" text="Orders" />
          <MenuItem icon="📦" text="Inventory" />
          <MenuItem icon="🔄" text="Returns" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6">

        {/* KPI Cards */}
        <KpiCard className="col-span-12 sm:col-span-6 md:col-span-3" 
                 icon={<ShoppingCart size={28} className="text-blue-600" />} 
                 title="Total Orders" value={totalOrders} trend={ordersTrend} />
        <KpiCard className="col-span-12 sm:col-span-6 md:col-span-3" 
                 icon={<TrendingUp size={28} className="text-green-600" />} 
                 title="Revenue" value={`$${totalRevenue}`} trend={ordersTrend} />
        <KpiCard className="col-span-12 sm:col-span-6 md:col-span-3" 
                 icon={<RotateCcw size={28} className="text-red-600" />} 
                 title="Returns" value={totalReturns} trend={ordersTrend} />
        <KpiCard className="col-span-12 sm:col-span-6 md:col-span-3" 
                 icon={<Package size={28} className="text-yellow-600" />} 
                 title="Inventory" value={totalInventory} trend={ordersTrend} />

        {/* Large Orders Trend Line Chart */}
        <ChartCard className="col-span-12 md:col-span-8" title="Orders Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="qty" stroke="#00C49F" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart */}
        <ChartCard className="col-span-12 md:col-span-4" title="Orders by Type">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ordersByType} dataKey="count" nameKey="type" outerRadius={120} label>
                {ordersByType.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard className="col-span-12 md:col-span-4" title="Orders by Brand">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByBrand}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brand" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Tables */}
        <TableCard className="col-span-12 md:col-span-7" title="Recent Orders" data={orders.slice(0,10)} />
        <TableCard className="col-span-12 md:col-span-5" title="Low Inventory Alerts" data={lowInventory} lowStock />

      </main>
    </div>
  );
}

// Menu Item
function MenuItem({ icon, text, active }) {
  return (
    <a href="#" className={`flex items-center gap-2 py-2 px-3 rounded font-medium ${active ? "bg-gray-200" : "hover:bg-gray-100"}`}>
      <span>{icon}</span> {text}
    </a>
  );
}

// KPI Card
function KpiCard({ icon, title, value, trend, className }) {
  const sparkData = trend.slice(-7).map((d,i) => ({ i, v: d.qty || 0 }));
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-5 hover:scale-105 transform transition ${className}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      <div className="mt-3">
        <ResponsiveContainer width="100%" height={30}>
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke="#00C49F" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Chart Card
function ChartCard({ title, children, className }) {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

// Table Card
function TableCard({ title, data, lowStock, className }) {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-6 overflow-x-auto ${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-700 text-sm sticky top-0">
          <tr>
            {Object.keys(data[0] || {}).map((key) => (
              <th key={key} className="border px-4 py-2 text-left">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row, idx) => (
            <tr key={idx} className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition ${lowStock && row.Stock < 5 ? 'bg-red-50' : ''}`}>
              {Object.values(row).map((val,i) => (
                <td key={i} className="border px-4 py-2">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useState, useEffect } from "react";

const InventoryAO = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tableHeaders = [
    "InventoryAO_ID",
    "Facility",
    "Location_",
    "Brand",
    "Model",
    "Screen_Size",
    "Processor",
    "RAM",
    "Hard_Drive",
    "Stand",
    "QTY_Recieved",
    "QTY_On_Hand",
  ];

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/api/Get_Inventory`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      if (data.success) {
        setInventoryList(data.data);
      } else {
        setInventoryList([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
        AO Inventory List
      </h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
          Error: {error}
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: "center", color: "#007bff" }}>
          Loading inventory...
        </p>
      ) : inventoryList.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No inventory found.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    style={{
                      border: "1px solid #ddd",
                      padding: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    {header.replace(/_/g, " ").replace("QTY", "Quantity ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((item) => (
                <tr key={item.InventoryAO_ID}>
                  {tableHeaders.map((field) => (
                    <td
                      key={field}
                      style={{
                        border: "1px solid #ddd",
                        padding: "0.5rem",
                      }}
                    >
                      {item[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryAO;

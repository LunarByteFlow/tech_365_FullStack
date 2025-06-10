import React, { useState, useEffect } from "react";

const baseUrl = "https://localhost:8000/api";

const InventoryAO = () => {
  const initialFormState = {
    InventoryAO_ID: "",
    Facility: "",
    Location_: "",
    Brand: "",
    Model: "",
    Screen_Size: "",
    Processor: "",
    RAM: "",
    Hard_Drive: "",
    Stand: "",
    QTY_Recieved: "",
    QTY_On_Hand: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [inventoryList, setInventoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all inventory records on component mount
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

  // Handle input changes in form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create new inventory
  const handleCreate = async () => {
    setError("");
    try {
      const res = await fetch(`https://localhost:8000/api/Create_Inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
        setForm(initialFormState);
      } else {
        setError(data.message || "Failed to create inventory");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Start editing an inventory
  const startEdit = (item) => {
    setEditingId(item.InventoryAO_ID);
    setForm({ ...item, QTY_Recieved: item.QTY_Recieved ?? "", QTY_On_Hand: item.QTY_On_Hand ?? "" });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError("");
  };

  // Update inventory
  const handleUpdate = async () => {
    setError("");
    try {
      const res = await fetch(`https://localhost:8000/api/Update_Inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
        cancelEdit();
      } else {
        setError(data.message || "Failed to update inventory");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete inventory by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;

    setError("");
    try {
      const res = await fetch(`https://localhost:8000/api/Delete_Inventory/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
      } else {
        setError(data.message || "Failed to delete inventory");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{editingId ? "Update Inventory" : "Create Inventory"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {Object.keys(initialFormState).map((field) => (
          <div key={field}>
            <label htmlFor={field} style={{ display: "block", fontWeight: "bold" }}>
              {field.replace(/_/g, " ")}
            </label>
            <input
              type={field.includes("QTY") ? "number" : "text"}
              name={field}
              id={field}
              value={form[field] || ""}
              onChange={handleChange}
              disabled={field === "InventoryAO_ID" && editingId !== null}
              style={{ width: "100%", padding: "0.3rem" }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={editingId ? handleUpdate : handleCreate}
        style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
      >
        {editingId ? "Update" : "Create"}
      </button>
      {editingId && (
        <button onClick={cancelEdit} style={{ padding: "0.5rem 1rem", backgroundColor: "#ccc" }}>
          Cancel
        </button>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Inventory List</h2>
      {loading ? (
        <p>Loading inventory...</p>
      ) : inventoryList.length === 0 ? (
        <p>No inventory found.</p>
      ) : (
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
              {Object.keys(initialFormState).map((header) => (
                <th key={header} style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                  {header.replace(/_/g, " ")}
                </th>
              ))}
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((item) => (
              <tr key={item.InventoryAO_ID}>
                {Object.keys(initialFormState).map((field) => (
                  <td key={field} style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                    {item[field]}
                  </td>
                ))}
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                  <button onClick={() => startEdit(item)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.InventoryAO_ID)} style={{ color: "red" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryAO;

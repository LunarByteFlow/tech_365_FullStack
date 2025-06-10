import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Don't forget to install uuid: npm install uuid

const API_BASE_URL = 'http://localhost:8000/api/desktops'; // !! ADJUST THIS if your backend URL or path is different !!
Create_DesktopInventory,
    Get_AllDesktopInventory,
    Get_DesktopInventoryById, // Added Get_DesktopInventoryById
    Update_DesktopInventory,
    Delete_DesktopInventory
const InventoryDesktops = () => {
  const initialFormState = {
    Inventory_Desktops_ID: '',
    Facility: '',
    Location_: '',
    Brand: '',
    Model: '',
    Type_: '',
    Processor: '',
    RAM: '',
    Hard_Drive: '',
    QTY_Recieved: '',
    QTY_On_Hand: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [inventoryList, setInventoryList] = useState([]);
  const [editingId, setEditingId] = useState(null); // Tracks the ID of the item being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success/info messages

  // Fetch all inventory records on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // --- API Functions ---

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:8000/api/Get_AllDesktopInventory");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch inventory.');
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInventoryList(data.data);
      } else {
        setInventoryList([]);
        setMessage(data.message || 'No desktop inventory records found.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError(null);
    setMessage(null);
    try {
      const payload = { ...form };
      // Generate a UUID for new items if ID is not provided (as per your backend API)
      if (!payload.Inventory_Desktops_ID) {
          payload.Inventory_Desktops_ID = uuidv4();
      }

      const res = await fetch("http://localhost:8000/api/Create_DesktopInventory", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create desktop inventory.');
      }
      fetchInventory(); // Refresh the list
      setForm(initialFormState); // Reset form
      setMessage('Desktop inventory item created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    setError(null);
    setMessage(null);
    try {
      // Your backend expects ID in URL params for update
      const res = await fetch(`http://localhost:8000/api/Update_DesktopInventory/:${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update desktop inventory.');
      }
      fetchInventory(); // Refresh the list
      cancelEdit(); // Reset form and editing state
      setMessage('Desktop inventory item updated successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;

    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`http://localhost:8000/api/Delete_DesktopInventory/:${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete desktop inventory.');
      }
      fetchInventory(); // Refresh the list
      setMessage('Desktop inventory item deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Form & State Management ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle number inputs
    const newValue = (name === 'QTY_Recieved' || name === 'QTY_On_Hand') ? parseInt(value) || '' : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const startEdit = (item) => {
    setEditingId(item.Inventory_Desktops_ID);
    // Set form state with item data, converting numbers to strings for input fields
    setForm({
      ...item,
      QTY_Recieved: item.QTY_Recieved !== null ? String(item.QTY_Recieved) : '',
      QTY_On_Hand: item.QTY_On_Hand !== null ? String(item.QTY_On_Hand) : '',
    });
    setError(null); // Clear any previous errors
    setMessage(null); // Clear any previous messages
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError(null);
    setMessage(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
        {editingId ? 'Update Desktop Inventory' : 'Create New Desktop Inventory'}
      </h2>

      {/* Message and Error Display */}
      {loading && <p style={{ color: '#007bff', textAlign: 'center' }}>Loading inventory...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Error: {error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      {/* Form Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        {Object.keys(initialFormState).map((field) => (
          <div key={field}>
            <label htmlFor={field} style={{ display: 'block', marginBottom: '0.2rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {field.replace(/_/g, ' ').replace('QTY', 'Quantity ')}:
            </label>
            <input
              type={field.includes('QTY') ? 'number' : 'text'}
              name={field}
              id={field}
              value={form[field] || ''}
              onChange={handleChange}
              disabled={field === 'Inventory_Desktops_ID' && editingId !== null} // Disable ID field when editing
              style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
            {field === 'Inventory_Desktops_ID' && !editingId && (
              <small style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
                A new ID will be generated for new entries.
              </small>
            )}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'right', marginBottom: '3rem' }}>
        <button
          onClick={editingId ? handleUpdate : handleCreate}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: editingId ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {editingId ? 'Update Inventory' : 'Create Inventory'}
        </button>
        {editingId && (
          <button
            onClick={cancelEdit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <hr style={{ margin: '2rem 0', border: '0', borderTop: '1px solid #eee' }} />

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Desktop Inventory List</h2>

      {/* Inventory List Table */}
      {loading && inventoryList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#007bff' }}>Loading inventory...</p>
      ) : inventoryList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No desktop inventory records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                {Object.keys(initialFormState).map((header) => (
                  <th key={header} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
                    {header.replace(/_/g, ' ').replace('QTY', 'Quantity ')}
                  </th>
                ))}
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((item) => (
                <tr key={item.Inventory_Desktops_ID} style={{ borderBottom: '1px solid #eee' }}>
                  {Object.keys(initialFormState).map((field) => (
                    <td key={field} style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {item[field]}
                    </td>
                  ))}
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.Inventory_Desktops_ID)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryDesktops;
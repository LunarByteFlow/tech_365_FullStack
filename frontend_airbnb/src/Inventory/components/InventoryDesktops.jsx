import React, { useState, useEffect } from 'react';

const InventoryDesktops = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch all inventory records on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

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

  const tableHeaders = [
    'Inventory_Desktops_ID',
    'Facility',
    'Location_',
    'Brand',
    'Model',
    'Type_',
    'Processor',
    'RAM',
    'Hard_Drive',
    'QTY_Recieved',
    'QTY_On_Hand',
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        Desktop Inventory List
      </h2>

      {loading && <p style={{ color: '#007bff', textAlign: 'center' }}>Loading inventory...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Error: {error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      {loading && inventoryList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#007bff' }}>Loading inventory...</p>
      ) : inventoryList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No desktop inventory records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f0f0f0',
                borderBottom: '2px solid #ddd'
              }}>
                {tableHeaders.map((header) => (
                  <th key={header} style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    textAlign: 'left'
                  }}>
                    {header.replace(/_/g, ' ').replace('QTY', 'Quantity ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((item) => (
                <tr key={item.Inventory_Desktops_ID} style={{
                  borderBottom: '1px solid #eee'
                }}>
                  {tableHeaders.map((field) => (
                    <td key={field} style={{
                      padding: '10px',
                      border: '1px solid #ddd'
                    }}>
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

export default InventoryDesktops;

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/returns"; // Change to your backend URL

function ReturnsApp() {
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [formData, setFormData] = useState({
    ReturnCode: "",
    RMA: "",
    OrderNumber: "",
    RetunTrackingNumber: "",
    Model: "",
    Return_Type: "",
    Cable_And_Charger: "",
    Comments: "",
    Action_Required: "",
    Process: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all returns
  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setReturns(res.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch returns");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Handle input changes for form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // Select a return record to view or edit
  const handleSelect = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${id}`);
      setSelectedReturn(res.data.data);
      setFormData(res.data.data);
      setIsEditing(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch return details");
      setSelectedReturn(null);
      setIsEditing(false);
    }
    setLoading(false);
  };

  // Create or update return record
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && selectedReturn) {
        // Update
        await axios.put(`${API_BASE}/${selectedReturn.Order_Returns_ID}`, formData);
        alert("Return record updated successfully.");
      } else {
        // Create
        await axios.post(API_BASE, formData);
        alert("Return record created successfully.");
      }
      setFormData({
        ReturnCode: "",
        RMA: "",
        OrderNumber: "",
        RetunTrackingNumber: "",
        Model: "",
        Return_Type: "",
        Cable_And_Charger: "",
        Comments: "",
        Action_Required: "",
        Process: "",
      });
      setSelectedReturn(null);
      setIsEditing(false);
      fetchReturns();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save return record");
    }
    setLoading(false);
  };

  // Delete a return record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this return record?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/${id}`);
      alert("Return record deleted successfully.");
      if (selectedReturn?.Order_Returns_ID === id) {
        setSelectedReturn(null);
        setIsEditing(false);
        setFormData({
          ReturnCode: "",
          RMA: "",
          OrderNumber: "",
          RetunTrackingNumber: "",
          Model: "",
          Return_Type: "",
          Cable_And_Charger: "",
          Comments: "",
          Action_Required: "",
          Process: "",
        });
      }
      fetchReturns();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete return record");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Order Returns Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: 40 }}>
        <h2>{isEditing ? "Edit Return Record" : "Create New Return Record"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          {[
            "ReturnCode",
            "RMA",
            "OrderNumber",
            "RetunTrackingNumber",
            "Model",
            "Return_Type",
            "Cable_And_Charger",
            "Action_Required",
            "Process",
          ].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/_/g, " ")}
              value={formData[field] || ""}
              onChange={handleChange}
              required={["ReturnCode", "Model"].includes(field)}
              style={{ padding: 8 }}
            />
          ))}
          <textarea
            name="Comments"
            placeholder="Comments"
            value={formData.Comments || ""}
            onChange={handleChange}
            rows={4}
            style={{ padding: 8 }}
          />

          <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSelectedReturn(null);
                setFormData({
                  ReturnCode: "",
                  RMA: "",
                  OrderNumber: "",
                  RetunTrackingNumber: "",
                  Model: "",
                  Return_Type: "",
                  Cable_And_Charger: "",
                  Comments: "",
                  Action_Required: "",
                  Process: "",
                });
              }}
              style={{ padding: "10px 20px", backgroundColor: "#ccc", marginLeft: 10 }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <h2>All Return Records</h2>
        {loading && !returns.length ? (
          <p>Loading returns...</p>
        ) : returns.length === 0 ? (
          <p>No return records found.</p>
        ) : (
          <table border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Return Code</th>
                <th>RMA</th>
                <th>Order Number</th>
                <th>Model</th>
                <th>Return Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <tr key={ret.Order_Returns_ID}>
                  <td>{ret.Order_Returns_ID}</td>
                  <td>{ret.ReturnCode}</td>
                  <td>{ret.RMA}</td>
                  <td>{ret.OrderNumber}</td>
                  <td>{ret.Model}</td>
                  <td>{ret.Return_Type}</td>
                  <td>
                    <button onClick={() => handleSelect(ret.Order_Returns_ID)} disabled={loading}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ret.Order_Returns_ID)}
                      disabled={loading}
                      style={{ marginLeft: 8, color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default ReturnsApp;

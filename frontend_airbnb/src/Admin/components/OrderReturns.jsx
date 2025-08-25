import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/SupabaseClient";
import Swal from "sweetalert2";

const initialFormState = {
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
};

const ReturnsApp = () => {
  const [returns, setReturns] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all return records
  const fetchReturns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Order_Returns").select("*");
      if (error) throw error;
      setReturns(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch return records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("Order_Returns")
          .update(formData)
          .eq("Order_Returns_ID", editingId);
        if (error) throw error;
        Swal.fire("Success", "Return record updated successfully!", "success");
      } else {
        // CREATE
        const { error } = await supabase.from("Order_Returns").insert([formData]);
        if (error) throw error;
        Swal.fire("Success", "Return record created successfully!", "success");
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchReturns();
    } catch (err) {
      Swal.fire("Error", err.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.Order_Returns_ID);
    setFormData({ ...item });
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this return record?")) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("Order_Returns")
        .delete()
        .eq("Order_Returns_ID", id);
      if (error) throw error;
      Swal.fire("Deleted!", "Return record deleted successfully!", "success");

      if (editingId === id) {
        handleCancelEdit();
      }

      fetchReturns();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete record", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Order Returns Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: 40 }}>
        <h2>{editingId ? "Edit Return Record" : "Create New Return Record"}</h2>
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
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
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
                    <button onClick={() => handleEdit(ret)} disabled={loading}>
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
};

export default ReturnsApp;

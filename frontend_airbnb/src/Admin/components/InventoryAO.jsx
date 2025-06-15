import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const BASE_URL = "http://10.2.0.2:8000/api";

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
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/Get_Inventory`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/Create_Inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
        setForm(initialFormState);
        setSuccessMsg("Inventory created successfully!");
      } else {
        setError(data.message || "Failed to create inventory");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.InventoryAO_ID);
    setForm({ ...item, QTY_Recieved: item.QTY_Recieved ?? "", QTY_On_Hand: item.QTY_On_Hand ?? "" });
    setError("");
    setSuccessMsg("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError("");
    setSuccessMsg("");
  };

  const handleUpdate = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/Update_Inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
        cancelEdit();
        setSuccessMsg("Inventory updated successfully!");
      } else {
        setError(data.message || "Failed to update inventory");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;

    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/Delete_Inventory/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
        setSuccessMsg("Inventory deleted successfully!");
      } else {
        setError(data.message || "Failed to delete inventory");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CSV Upload handler
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setSuccessMsg("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/UploadInventoryCSV`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg("CSV uploaded successfully!");
        fetchInventory();
      } else {
        setError(data.message || "Failed to upload CSV");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      event.target.value = null; // reset file input
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        {editingId ? "Update Inventory" : "Create Inventory"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Box mb={3}>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleCSVUpload}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Upload CSV
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        {Object.keys(initialFormState).map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field}>
            <TextField
              fullWidth
              label={field.replace(/_/g, " ")}
              name={field}
              type={field.includes("QTY") ? "number" : "text"}
              value={form[field] || ""}
              onChange={handleChange}
              disabled={field === "InventoryAO_ID" && editingId !== null}
              size="small"
            />
          </Grid>
        ))}
      </Grid>

      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={editingId ? handleUpdate : handleCreate}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : editingId ? "Update" : "Create"}
        </Button>
        {editingId && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={cancelEdit}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Typography variant="h5" gutterBottom>
        Inventory List
      </Typography>

      {loading && !inventoryList.length ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : inventoryList.length === 0 ? (
        <Typography>No inventory found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="inventory table">
            <TableHead>
              <TableRow>
                {Object.keys(initialFormState).map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>
                    {header.replace(/_/g, " ")}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryList.map((item) => (
                <TableRow key={item.InventoryAO_ID}>
                  {Object.keys(initialFormState).map((field) => (
                    <TableCell key={field}>{item[field]}</TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => startEdit(item)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.InventoryAO_ID)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default InventoryAO;

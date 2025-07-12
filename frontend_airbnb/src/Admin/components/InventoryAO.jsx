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
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const BASE_URL = "http://10.2.0.2:8000/api";

const InventoryAO = () => {
  const initialFormState = {
    Facility: "",
    Location: "",
    Brand: "",
    Model: "",
    Screen_Size: "",
    Processor: "",
    RAM: "",
    Hard_Drive: "",
    Stand: "",
    QTY_Received: "",
    QTY_on_Hand: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [inventoryList, setInventoryList] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef(null);

  // Filters
  const [filters, setFilters] = useState({
    Facility: "",
    Brand: "",
    Location: "",
    Model: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, inventoryList]);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/Get_Inventory`);
      const data = await res.json();
      if (res.ok && data.success) {
        setInventoryList(data.data);
      } else {
        setError(data.message || "Failed to fetch inventory");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = inventoryList.filter((item) =>
      Object.entries(filters).every(
        ([key, value]) =>
          !value || item[key]?.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredInventory(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${BASE_URL}/Create_Inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Inventory created successfully!");
        fetchInventory();
        setForm(initialFormState);
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
    setForm({
      ...item,
      QTY_Received: item.QTY_Received ?? "",
      QTY_on_Hand: item.QTY_on_Hand ?? "",
    });
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
    if (!editingId) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${BASE_URL}/Update_Inventory/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Inventory updated successfully!");
        fetchInventory();
        cancelEdit();
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
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${BASE_URL}/Delete_Inventory/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Inventory deleted successfully!");
        fetchInventory();
      } else {
        setError(data.message || "Failed to delete inventory");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/UploadInventoryCSV`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("CSV uploaded successfully!");
        fetchInventory();
      } else {
        setError(data.message || "Failed to upload CSV");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        {editingId ? "Update Inventory" : "Create Inventory"}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <Box mb={2}>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleCSVUpload}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
        >
          Upload CSV
        </Button>
      </Box>

      {/* Form Grid */}
      <Grid container spacing={2} mb={3}>
        {Object.keys(initialFormState).map((field) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={field}>
            <TextField
              fullWidth
              size="small"
              label={field.replace(/_/g, " ")}
              name={field}
              type={field.includes("QTY") ? "number" : "text"}
              value={form[field]}
              onChange={handleChange}
            />
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
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
          <Button variant="outlined" color="secondary" onClick={cancelEdit} disabled={loading}>
            Cancel
          </Button>
        )}
      </Box>

      <Typography variant="h5" gutterBottom>
        AIO Inventory List
      </Typography>

      {/* Filter UI */}
      <Grid container spacing={2} mb={2}>
        {["Facility", "Location", "Brand", "Model","Screen_Size","Processor",'RAM',"Hard_Drive","Stand","QTY_Received","QTY_On_Hand"].map((filterKey) => (
          <Grid item xs={12} sm={6} md={3} key={filterKey}>
            <TextField
              fullWidth
              size="small"
              label={`Filter by ${filterKey}`}
              name={filterKey}
              value={filters[filterKey]}
              onChange={handleFilterChange}
            />
          </Grid>
        ))}
      </Grid>

      {loading && !inventoryList.length ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredInventory.length === 0 ? (
        <Typography>No inventory found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
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
              {filteredInventory.map((item) => (
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

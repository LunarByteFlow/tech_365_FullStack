import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Swal from "sweetalert2";
import { supabase } from "../../supabase/SupabaseClient";

const InventoryAO = () => {
  const initialFormState = {
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

  const numericFields = ["QTY_Recieved", "QTY_On_Hand"];
  const sanitizeFormData = (data) => {
    const sanitized = { ...data };
    numericFields.forEach((field) => {
      sanitized[field] =
        sanitized[field] === "" || sanitized[field] === null
          ? null
          : Number(sanitized[field]);
    });
    return sanitized;
  };

  const [form, setForm] = useState(initialFormState);
  const [inventoryList, setInventoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch inventory from Supabase
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Inventory_AO").select("*");
      if (error) throw error;
      setInventoryList(data);
    } catch (err) {
      setError(err.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async () => {
    const sanitizedData = sanitizeFormData(form);
    try {
      if (!editingId) {
        // CREATE
        const { error } = await supabase
          .from("Inventory_AO")
          .insert([sanitizedData]);
        if (error) throw error;
        Swal.fire("Success", "Inventory created successfully!", "success");
      } else {
        // UPDATE
        const { error } = await supabase
          .from("Inventory_AO")
          .update(sanitizedData)
          .eq("InventoryAO_ID", editingId);
        if (error) throw error;
        Swal.fire("Success", "Inventory updated successfully!", "success");
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      Swal.fire("Error", err.message || "Operation failed", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.InventoryAO_ID);
    setForm({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from("Inventory_AO")
        .delete()
        .eq("InventoryAO_ID", id);
      if (error) throw error;
      Swal.fire("Deleted!", "Inventory deleted successfully!", "success");
      fetchInventory();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete inventory", "error");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        {editingId ? "Update Inventory" : "Create Inventory"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
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

      {/* Buttons */}
      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOrUpdate}
          sx={{ mr: 2 }}
        >
          {editingId ? "Update" : "Create"}
        </Button>
        {editingId && (
          <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </Box>

      {/* Inventory Table */}
      <Typography variant="h5" gutterBottom>
        AIO Inventory List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : inventoryList.length === 0 ? (
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
              {inventoryList.map((item) => (
                <TableRow key={item.InventoryAO_ID}>
                  {Object.keys(initialFormState).map((field) => (
                    <TableCell key={field}>{item[field]}</TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(item)}
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

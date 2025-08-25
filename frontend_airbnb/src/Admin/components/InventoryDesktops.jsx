import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { supabase } from "../../supabase/SupabaseClient";

const initialFormState = {
  Facility: "",
  Location_: "",
  Brand: "",
  Model: "",
  Type_: "",
  Processor: "",
  RAM: "",
  Hard_Drive: "",
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

const InventoryDesktops = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [filters, setFilters] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all desktops
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Inventory_Desktops").select("*");
      if (error) throw error;
      setInventoryList(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch inventory.");
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredInventoryList = inventoryList.filter((item) =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return item[key]
        ?.toString()
        .toLowerCase()
        .includes(filters[key].toString().toLowerCase());
    })
  );

  const handleSubmit = async () => {
    const sanitizedData = sanitizeFormData(form);
    try {
      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("Inventory_Desktops")
          .update(sanitizedData)
          .eq("Inventory_Desktops_ID", editingId);
        if (error) throw error;
        Swal.fire("Success", "Desktop inventory updated successfully!", "success");
      } else {
        // CREATE
        const { error } = await supabase
          .from("Inventory_Desktops")
          .insert([sanitizedData]);
        if (error) throw error;
        Swal.fire("Success", "Desktop inventory created successfully!", "success");
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      Swal.fire("Error", err.message || "Operation failed", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.Inventory_Desktops_ID);
    setForm({ ...item });
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this desktop?")) return;

    try {
      const { error } = await supabase
        .from("Inventory_Desktops")
        .delete()
        .eq("Inventory_Desktops_ID", id);
      if (error) throw error;
      Swal.fire("Deleted!", "Desktop inventory deleted successfully!", "success");
      fetchInventory();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete desktop", "error");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        {editingId ? "Update Desktop Inventory" : "Create New Desktop Inventory"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={3} columnGap={3} sx={{ mb: 4 }}>
        {Object.keys(initialFormState).map((field) => {
          const label = field.replace(/_/g, " ").replace("QTY", "Quantity");
          const isNumberField = numericFields.includes(field);
          return (
            <TextField
              key={field}
              label={label}
              name={field}
              value={form[field]}
              type={isNumberField ? "number" : "text"}
              onChange={handleChange}
              disabled={field === "Inventory_Desktops_ID" && editingId !== null}
              sx={{ flex: "1 1 220px", minWidth: 200 }}
              size="small"
            />
          );
        })}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={4}>
        {editingId && (
          <Button variant="outlined" color="error" onClick={handleCancelEdit}>
            Cancel Edit
          </Button>
        )}
        <Button variant="contained" onClick={handleSubmit}>
          {editingId ? "Update Inventory" : "Create Inventory"}
        </Button>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Filter Desktop Inventory
      </Typography>

      <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={2} columnGap={3} sx={{ mb: 4 }}>
        {Object.keys(initialFormState).map((field) => {
          const label = field.replace(/_/g, " ").replace("QTY", "Quantity");
          return (
            <TextField
              key={field}
              label={`Filter by ${label}`}
              name={field}
              value={filters[field]}
              onChange={handleFilterChange}
              sx={{ flex: "1 1 200px", minWidth: 180 }}
              size="small"
            />
          );
        })}
      </Stack>

      <Typography variant="h6" gutterBottom>
        Desktop Inventory List
      </Typography>

      {loading ? (
        <Stack alignItems="center" my={3}>
          <CircularProgress />
        </Stack>
      ) : filteredInventoryList.length === 0 ? (
        <Typography>No desktop inventory records found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="desktop inventory table">
            <TableHead>
              <TableRow>
                {Object.keys(initialFormState).map((header) => (
                  <TableCell key={header}>
                    {header.replace(/_/g, " ").replace("QTY", "Quantity")}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventoryList.map((item) => (
                <TableRow key={item.Inventory_Desktops_ID}>
                  {Object.keys(initialFormState).map((field) => (
                    <TableCell key={field}>{item[field]}</TableCell>
                  ))}
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.Inventory_Desktops_ID)}
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
    </Paper>
  );
};

export default InventoryDesktops;

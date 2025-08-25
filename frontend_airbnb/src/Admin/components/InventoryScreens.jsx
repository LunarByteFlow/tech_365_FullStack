import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../supabase/SupabaseClient";

const initialFormState = {
  Facility: "",
  Location_: "",
  Brand: "",
  Model: "",
  Screen_Size: "",
  Ports_: "",
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

const InventoryScreens = () => {
  const [screens, setScreens] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all screens
  const fetchScreens = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Inventory_Screens")
        .select("*");
      if (error) throw error;
      setScreens(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch screens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const sanitizedData = sanitizeFormData(form);
    try {
      if (!editingId) {
        // Insert new screen
        const payload = { ...sanitizedData }; // DO NOT include Inventory_Screens_ID
        const { error } = await supabase
          .from("Inventory_Screens")
          .insert([payload]);
        if (error) throw error;
        Swal.fire("Success", "Screen created successfully!", "success");
      } else {
        // Update existing screen
        const { error } = await supabase
          .from("Inventory_Screens")
          .update(sanitizedData)
          .eq("Inventory_Screens_ID", editingId);
        if (error) throw error;
        Swal.fire("Success", "Screen updated successfully!", "success");
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchScreens();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to submit screen", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.Inventory_Screens_ID);
    setForm({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this screen?"
    );
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from("Inventory_Screens")
        .delete()
        .eq("Inventory_Screens_ID", id);
      if (error) throw error;
      Swal.fire("Deleted!", "Screen deleted successfully!", "success");
      fetchScreens();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete screen", "error");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        {editingId ? "Update Screen" : "Add New Screen"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction="row"
        spacing={3}
        flexWrap="wrap"
        rowGap={3}
        columnGap={3}
        sx={{ mb: 4 }}
      >
        {Object.keys(initialFormState).map((field) => (
          <TextField
            key={field}
            label={field.replace(/_/g, " ")}
            name={field}
            value={form[field]}
            onChange={handleChange}
            sx={{ flex: "1 1 220px", minWidth: 200 }}
            size="small"
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={4}>
        {editingId && (
          <Button variant="outlined" color="error" onClick={handleCancelEdit}>
            Cancel Edit
          </Button>
        )}
        <Button variant="contained" onClick={handleSubmit}>
          {editingId ? "Update Screen" : "Create Screen"}
        </Button>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Screens Inventory List
      </Typography>

      {loading ? (
        <Stack alignItems="center" my={3}>
          <CircularProgress />
        </Stack>
      ) : screens.length === 0 ? (
        <Typography>No screens found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="screen inventory table">
            <TableHead>
              <TableRow>
                {Object.keys(initialFormState).map((header) => (
                  <TableCell key={header}>
                    {header.replace(/_/g, " ")}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {screens.map((item) => (
                <TableRow key={item.Inventory_Screens_ID}>
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
                      onClick={() => handleDelete(item.Inventory_Screens_ID)}
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

export default InventoryScreens;

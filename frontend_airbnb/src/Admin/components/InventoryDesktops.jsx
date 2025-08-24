import React, { useEffect, useState } from "react";
import axios from "axios";
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

import { supabase } from "../../supabase/SupabaseClient"; // <-- Import your Supabase client
const BASE_URL = "http://192.168.0.50:8000/api";

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

const InventoryDesktops = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [filters, setFilters] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // useEffect(() => {
  //   fetch_Inventory_Desktops();
  // }, []);

  // const fetch_Inventory_Desktops = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setMessage(null);
  //   try {
  //     const res = await axios.get(`${BASE_URL}/Get_AllDesktopInventory`);
  //     if (res.data.success) {
  //       setInventoryList(res.data.data || []);
  //     } else {
  //       setInventoryList([]);
  //       setMessage(res.data.message || "No desktop inventory records found.");
  //     }
  //   } catch (err) {
  //     setError("Failed to fetch inventory.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetch_Inventory_Desktops = async () => {
        setLoading(true);
        try {
          // Supabase: SELECT * FROM your_table_name
          // Replace 'your_table_name' with your actual Supabase table name.
          const { data, error } = await supabase.from("Inventory_Desktops").select("*");
          if (error) {
            throw new Error(error.message);
          }
          setInventoryList(data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      };
    useEffect(() => {
      fetch_Inventory_Desktops();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val =
      name === "QTY_Recieved" || name === "QTY_On_Hand"
        ? value === ""
          ? ""
          : Number(value)
        : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    try {
      let payload = { ...form };

      if (!editingId) {
        payload.Inventory_Desktops_ID = uuidv4();
        const res = await axios.post(
          `${BASE_URL}/Create_DesktopInventory`,
          payload
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Create failed");
        setMessage("Desktop inventory item created successfully!");
      } else {
        const res = await axios.put(
          `${BASE_URL}/Update_DesktopInventory/${editingId}`,
          payload
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Update failed");
        setMessage("Desktop inventory item updated successfully!");
      }

      fetch_Inventory_Desktops();
      setForm(initialFormState);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Error submitting data.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.Inventory_Desktops_ID);
    setForm({
      ...item,
      QTY_Recieved: item.QTY_Recieved || "",
      QTY_On_Hand: item.QTY_On_Hand || "",
    });
    setError(null);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError(null);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setError(null);
    setMessage(null);
    try {
      const res = await axios.delete(
        `${BASE_URL}/Delete_DesktopInventory/${id}`
      );
      if (!res.data.success)
        throw new Error(res.data.message || "Delete failed");
      setMessage("Desktop inventory item deleted successfully!");
      fetch_Inventory_Desktops();
    } catch (err) {
      setError(err.message || "Error deleting item.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredInventoryList = inventoryList.filter((item) =>
    Object.keys(filters).every((key) => {
      if (filters[key] === "") return true;
      return item[key]
        ?.toString()
        .toLowerCase()
        .includes(filters[key].toString().toLowerCase());
    })
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        {editingId
          ? "Update Desktop Inventory"
          : "Create New Desktop Inventory"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
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
        {Object.keys(initialFormState).map((field) => {
          const label = field.replace(/_/g, " ").replace("QTY", "Quantity");
          const isNumberField =
            field === "QTY_Recieved" || field === "QTY_On_Hand";
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

      <Stack
        direction="row"
        spacing={3}
        flexWrap="wrap"
        rowGap={2}
        columnGap={3}
        sx={{ mb: 4 }}
      >
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

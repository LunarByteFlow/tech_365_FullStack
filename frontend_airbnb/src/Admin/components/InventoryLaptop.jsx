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
  Grid,
  Collapse,
} from "@mui/material";
import Swal from "sweetalert2";
import { supabase } from "../../supabase/SupabaseClient";

const InventoryLaptop = () => {
  const initialFormState = {
    Facility: "",
    Location_: "",
    Brand: "",
    Model: "",
    Desk_Type: "",
    Processor: "",
    RAM: "",
    Hard_Drive: "",
    Screen_Size: "",
    Resolution: "",
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

  const [laptops, setLaptops] = useState([]);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [filters, setFilters] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all laptops
  const fetchLaptops = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Inventory_Laptops").select("*");
      if (error) throw error;
      setLaptops(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch laptops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredLaptops = laptops.filter((laptop) =>
    Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      return laptop[key]?.toString().toLowerCase().includes(val.toLowerCase());
    })
  );

  const handleSubmit = async () => {
    const sanitizedData = sanitizeFormData(formData);
    try {
      if (editingLaptop) {
        // UPDATE
        const { error } = await supabase
          .from("Inventory_Laptops")
          .update(sanitizedData)
          .eq("Inventory_Laptops_ID", editingLaptop.Inventory_Laptops_ID);
        if (error) throw error;
        Swal.fire("Success", "Laptop updated successfully!", "success");
      } else {
        // CREATE
        const { error } = await supabase
          .from("Inventory_Laptops")
          .insert([sanitizedData]);
        if (error) throw error;
        Swal.fire("Success", "Laptop added successfully!", "success");
      }
      setFormData(initialFormState);
      setEditingLaptop(null);
      setShowForm(false);
      fetchLaptops();
    } catch (err) {
      Swal.fire("Error", err.message || "Operation failed", "error");
    }
  };

  const handleEdit = (laptop) => {
    setEditingLaptop(laptop);
    setFormData({ ...laptop });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingLaptop(null);
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this laptop?");
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from("Inventory_Laptops")
        .delete()
        .eq("Inventory_Laptops_ID", id);
      if (error) throw error;
      Swal.fire("Deleted!", "Laptop deleted successfully!", "success");
      fetchLaptops();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete laptop", "error");
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Laptop Inventory Manager
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          setFormData(initialFormState);
          setShowForm(true);
        }}
        sx={{ mb: 2 }}
      >
        + Add New Laptop
      </Button>

      {/* Conditional Form */}
      <Collapse in={showForm}>
        <Paper sx={{ padding: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingLaptop ? "Edit Laptop" : "Add New Laptop"}
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.replace(/_/g, " ")}
                  name={key}
                  fullWidth
                  value={formData[key]}
                  onChange={handleChange}
                  type={numericFields.includes(key) ? "number" : "text"}
                  disabled={key === "Inventory_Laptops_ID" && editingLaptop}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2, mr: 1 }}
          >
            {editingLaptop ? "Update" : "Create"}
          </Button>
          <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Paper>
      </Collapse>

      {/* Filters */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Filter Inventory
      </Typography>
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Grid container spacing={2}>
          {Object.keys(filters).map((key) => (
            <Grid item xs={12} sm={3} md={2} key={key}>
              <TextField
                label={key.replace(/_/g, " ")}
                name={key}
                fullWidth
                size="small"
                value={filters[key]}
                onChange={handleFilterChange}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Table */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Inventory List
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {Object.keys(formData).map((key) => (
                <TableCell key={key}>{key.replace(/_/g, " ")}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLaptops.map((laptop) => (
              <TableRow key={laptop.Inventory_Laptops_ID}>
                {Object.keys(formData).map((key) => (
                  <TableCell key={key}>{laptop[key]}</TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(laptop)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(laptop.Inventory_Laptops_ID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryLaptop;

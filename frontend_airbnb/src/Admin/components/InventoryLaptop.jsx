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
  Grid,
  Collapse,
} from "@mui/material";

const InventoryLaptop = () => {
  const [laptops, setLaptops] = useState([]);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    // Inventory_Laptops_ID: "",
    Facility: "",
    Location_: "",
    Brand: "",
    Model: "",
    Type_: "",
    Processor: "",
    RAM: "",
    Hard_Drive: "",
    Screen_Size: "",
    Resolution: "",
    QTY_Recieved: "",
    QTY_On_Hand: "",
  });

  const [filters, setFilters] = useState({
    // Inventory_Laptops_ID: "",
    Facility: "",
    Location_: "",
    Brand: "",
    Model: "",
    Type_: "",
    Processor: "",
    RAM: "",
    Hard_Drive: "",
    Screen_Size: "",
    Resolution: "",
    QTY_Recieved: "",
    QTY_On_Hand: "",
  });

  const BASE_URL = "http://10.2.0.2:8000/api";

  const generateID = () => "LAP-" + Date.now();

  const fetchLaptops = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllLaptopInventory`);
      setLaptops(res.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/Delete_LaptopInventory/${id}`);
      fetchLaptops();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (laptop) => {
    setEditingLaptop(laptop);
    setFormData({ ...laptop });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingLaptop(null);
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      Inventory_Laptops_ID: generateID(),
      Facility: "",
      Location_: "",
      Brand: "",
      Model: "",
      Type_: "",
      Processor: "",
      RAM: "",
      Hard_Drive: "",
      Screen_Size: "",
      Resolution: "",
      QTY_Recieved: "",
      QTY_On_Hand: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingLaptop) {
        await axios.put(
          `${BASE_URL}/Update_LaptopInventory/${editingLaptop.Inventory_Laptops_ID}`,
          formData
        );
      } else {
        await axios.post(`${BASE_URL}/Create_LaptopInventory`, formData);
      }
      fetchLaptops();
      handleCancel();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Handle filters change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filtering laptops according to filters state (case insensitive, partial matches)
  const filteredLaptops = laptops.filter((laptop) => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (!filterValue) return true; // no filter applied on this column
      const laptopValue = laptop[key];
      if (laptopValue === null || laptopValue === undefined) return false;
      return laptopValue
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  });

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Laptop Inventory Manager
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          resetForm();
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
            {Object.entries(formData).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.replace(/_/g, " ")}
                  name={key}
                  fullWidth
                  value={value}
                  onChange={handleChange}
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

      {/* Filters Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Filter Inventory
      </Typography>
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Grid container spacing={2}>
          {Object.entries(filters).map(([key, value]) => (
            <Grid item xs={12} sm={3} md={2} key={key}>
              <TextField
                label={key.replace(/_/g, " ")}
                name={key}
                fullWidth
                value={value}
                onChange={handleFilterChange}
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Table Section */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Inventory List
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
  <TableRow>
    <TableCell>Facility</TableCell>
    <TableCell>Location</TableCell>
    <TableCell>Brand</TableCell>
    <TableCell>Model</TableCell>
    <TableCell>Type</TableCell>
    <TableCell>Processor</TableCell>
    <TableCell>RAM</TableCell>
    <TableCell>Hard Drive</TableCell>
    <TableCell>Screen Size</TableCell>
    <TableCell>Resolution</TableCell>
    <TableCell>QTY Received</TableCell>
    <TableCell>QTY on Hand</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {filteredLaptops.map((laptop) => (
    <TableRow key={laptop.Inventory_Laptops_ID}>
      <TableCell>{laptop.Facility}</TableCell>
      <TableCell>{laptop.Location_}</TableCell>
      <TableCell>{laptop.Brand}</TableCell>
      <TableCell>{laptop.Model}</TableCell>
      <TableCell>{laptop.Type_}</TableCell>
      <TableCell>{laptop.Processor}</TableCell>
      <TableCell>{laptop.RAM}</TableCell>
      <TableCell>{laptop.Hard_Drive}</TableCell>
      <TableCell>{laptop.Screen_Size}</TableCell>
      <TableCell>{laptop.Resolution}</TableCell>
      <TableCell>{laptop.QTY_Recieved}</TableCell>
      <TableCell>{laptop.QTY_On_Hand}</TableCell>
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

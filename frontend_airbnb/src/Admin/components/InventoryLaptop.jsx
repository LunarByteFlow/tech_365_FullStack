import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Grid
} from '@mui/material';

const InventoryLaptop = () => {
  const [laptops, setLaptops] = useState([]);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [formData, setFormData] = useState({
    Inventory_Laptops_ID: '',
    Facility: '',
    Location_: '',
    Brand: '',
    Model: '',
    Desk_Type: '',
    Processor: '',
    RAM: '',
    Hard_Drive: '',
    Screen_Size: '',
    Resolution: '',
    QTY_Recieved: '',
    QTY_On_Hand: ''
  });
  const BASE_URL= "http://10.2.0.2:8000/api";

  const generateID = () => 'LAP-' + Date.now();

  const fetchLaptops = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllLaptopInventory`);
      setLaptops(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/Delete_LaptopInventory/${id}`);
      fetchLaptops();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (laptop) => {
    setEditingLaptop(laptop);
    setFormData({ ...laptop });
  };

  const handleCancel = () => {
    setEditingLaptop(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      Inventory_Laptops_ID: generateID(),
      Facility: '',
      Location_: '',
      Brand: '',
      Model: '',
      Desk_Type: '',
      Processor: '',
      RAM: '',
      Hard_Drive: '',
      Screen_Size: '',
      Resolution: '',
      QTY_Recieved: '',
      QTY_On_Hand: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingLaptop) {
        await axios.put(
          `http://localhost:8000/api/Update_LaptopInventory/${editingLaptop.Inventory_Laptops_ID}`,
          formData
        );
      } else {
        await axios.post('http://localhost:8000/api/Create_LaptopInventory', formData);
      }
      fetchLaptops();
      handleCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Laptop Inventory Manager
      </Typography>

      {/* Form Section */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        {editingLaptop ? 'Edit Laptop' : 'Add New Laptop'}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {Object.entries(formData).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              label={key}
              name={key}
              fullWidth
              value={value}
              onChange={handleChange}
              disabled={key === 'Inventory_Laptops_ID' && editingLaptop}
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" onClick={handleSubmit} sx={{ mr: 1 }}>
        {editingLaptop ? 'Update' : 'Create'}
      </Button>
      {editingLaptop && (
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      )}

      {/* Table Section */}
      <Typography variant="h6" sx={{ mt: 5 }}>
        Inventory List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Processor</TableCell>
              <TableCell>RAM</TableCell>
              <TableCell>QTY</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laptops.map((laptop) => (
              <TableRow key={laptop.Inventory_Laptops_ID}>
                <TableCell>{laptop.Inventory_Laptops_ID}</TableCell>
                <TableCell>{laptop.Brand}</TableCell>
                <TableCell>{laptop.Model}</TableCell>
                <TableCell>{laptop.Processor}</TableCell>
                <TableCell>{laptop.RAM}</TableCell>
                <TableCell>{laptop.QTY_On_Hand}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(laptop)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(laptop.Inventory_Laptops_ID)}>
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

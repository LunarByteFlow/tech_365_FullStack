import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Grid, Collapse
} from '@mui/material';

const InventoryParts = () => {
  const BASE_URL = "http://10.2.0.2:8000/api";

  const [parts, setParts] = useState([]);
  const [editingPart, setEditingPart] = useState(null);
  const [showForm, setShowForm] = useState(false); // 👈 NEW STATE

  const [formData, setFormData] = useState({
    Inventory_Parts_ID: '',
    Facility: '',
    Location_: '',
    Brand: '',
    Model: '',
    Type_: '',
    Comments: '',
    QTY_Recieved: '',
    QTY_On_Hand: ''
  });

  const generateID = () => 'PART-' + Date.now();

  const fetchParts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllPartInventory`);
      setParts(res.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/Delete_PartInventory/${id}`);
      fetchParts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setFormData({ ...part });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingPart(null);
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      Inventory_Parts_ID: generateID(),
      Facility: '',
      Location_: '',
      Brand: '',
      Model: '',
      Type_: '',
      Comments: '',
      QTY_Recieved: '',
      QTY_On_Hand: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingPart) {
        await axios.put(`${BASE_URL}/Update_PartInventory/${editingPart.Inventory_Parts_ID}`, formData);
      } else {
        await axios.post(`${BASE_URL}/Create_PartInventory`, formData);
      }
      fetchParts();
      handleCancel();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Inventory Parts Manager
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        sx={{ mb: 2 }}
      >
        + Add New Part
      </Button>

      {/* Conditional Form */}
      <Collapse in={showForm}>
        <Paper sx={{ padding: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingPart ? 'Edit Part' : 'Add New Part'}
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(formData).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.replace(/_/g, ' ')}
                  name={key}
                  fullWidth
                  value={value}
                  onChange={handleChange}
                  disabled={key === 'Inventory_Parts_ID' && editingPart}
                />
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2, mr: 1 }}>
            {editingPart ? 'Update' : 'Create'}
          </Button>
          <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Paper>
      </Collapse>

      {/* Table Section */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Inventory List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>QTY On Hand</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((part) => (
              <TableRow key={part.Inventory_Parts_ID}>
                <TableCell>{part.Inventory_Parts_ID}</TableCell>
                <TableCell>{part.Brand}</TableCell>
                <TableCell>{part.Model}</TableCell>
                <TableCell>{part.Location_}</TableCell>
                <TableCell>{part.Type_}</TableCell>
                <TableCell>{part.QTY_On_Hand}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(part)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(part.Inventory_Parts_ID)}
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

export default InventoryParts;

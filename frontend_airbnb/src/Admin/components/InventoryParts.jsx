import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Paper, Typography, Stack
} from '@mui/material';

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL= "http://10.2.0.2:8000/api";

const InventoryParts = ({ editingPart, onCancel, onSuccess }) => {
  const initialForm = {
    Inventory_Parts_ID: '',
    Facility: '',
    Location_: '',
    Brand: '',
    Model: '',
    Type_: '',
    Comments: '',
    QTY_Recieved: '',
    QTY_On_Hand: '',
  };

  const [form, setForm] = useState(initialForm);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingPart) {
      setForm({
        ...editingPart,
        QTY_Recieved: editingPart.QTY_Recieved ?? '',
        QTY_On_Hand: editingPart.QTY_On_Hand ?? '',
      });
    } else {
      setForm(initialForm);
    }
  }, [editingPart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingPart) {
        // Update existing part
        await axios.put(`${BASE_URL}/Update_PartInventory/${editingPart.Inventory_Parts_ID}`, form);
      } else {
        // Create new part
        await axios.post(`${BASE_URL}/Create_PartInventory`, form);
      }
      onSuccess(); // callback to refresh list + close form
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ padding: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {editingPart ? 'Edit Part' : 'Add New Part'}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Inventory Parts ID"
          name="Inventory_Parts_ID"
          value={form.Inventory_Parts_ID}
          onChange={handleChange}
          disabled={!!editingPart} // Disable when editing
        />
        <TextField label="Facility" name="Facility" value={form.Facility} onChange={handleChange} />
        <TextField label="Location" name="Location_" value={form.Location_} onChange={handleChange} />
        <TextField label="Brand" name="Brand" value={form.Brand} onChange={handleChange} />
        <TextField label="Model" name="Model" value={form.Model} onChange={handleChange} />
        <TextField label="Type" name="Type_" value={form.Type_} onChange={handleChange} />
        <TextField label="Comments" name="Comments" value={form.Comments} onChange={handleChange} />
        <TextField
          label="QTY Recieved"
          name="QTY_Recieved"
          type="number"
          value={form.QTY_Recieved}
          onChange={handleChange}
        />
        <TextField
          label="QTY On Hand"
          name="QTY_On_Hand"
          type="number"
          value={form.QTY_On_Hand}
          onChange={handleChange}
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>
            {editingPart ? 'Update' : 'Create'}
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default InventoryParts;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography
} from '@mui/material';

const InventoryScreens = ({ onEdit }) => {
  const [screens, setScreens] = useState([]);
  // BASE_URL = "http://localhost:8000/api";
  const BASE_URL= "http://10.2.0.2:8000/api";

  const fetchScreens = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllInventoryScreens`); // Adjust URL
      setScreens(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/Delete_InventoryScreen/${id}`);
      fetchScreens();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Inventory Screens</Typography>
      <Button variant="contained" onClick={() => onEdit(null)} sx={{ mb: 2 }}>
        Add New Screen
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Screen Size</TableCell>
              <TableCell>Ports</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {screens.map((screen) => (
              <TableRow key={screen.Inventory_Screens_ID}>
                <TableCell>{screen.Brand}</TableCell>
                <TableCell>{screen.Model}</TableCell>
                <TableCell>{screen.Screen_Size}</TableCell>
                <TableCell>{screen.Ports_}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(screen)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(screen.Inventory_Screens_ID)}
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

export default InventoryScreens;

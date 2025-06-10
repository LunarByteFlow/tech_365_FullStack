import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography
} from '@mui/material';
const BASE_URL= "http://localhost:8000/api"
const InventoryParts = () => {
  const [parts, setParts] = useState([]);

  const fetchParts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllPartInventory`); // Adjust URL if needed
      setParts(res.data.data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Part Inventory</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Qty On Hand</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((part) => (
              <TableRow key={part.Inventory_Parts_ID}>
                <TableCell>{part.Brand}</TableCell>
                <TableCell>{part.Model}</TableCell>
                <TableCell>{part.Type_}</TableCell>
                <TableCell>{part.QTY_On_Hand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryParts;

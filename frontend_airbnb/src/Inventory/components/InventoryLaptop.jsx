import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography
} from '@mui/material';

const InventoryLaptop = () => {
  const [laptops, setLaptops] = useState([]);

  const fetchLaptops = async () => {
    try {
      const res = await axios.get('/api/laptops'); // Adjust URL if needed
      setLaptops(res.data.data);
    } catch (error) {
      console.error('Error fetching laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Laptop Inventory</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Processor</TableCell>
              <TableCell>RAM</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laptops.map((laptop) => (
              <TableRow key={laptop.Inventory_Laptops_ID}>
                <TableCell>{laptop.Brand}</TableCell>
                <TableCell>{laptop.Model}</TableCell>
                <TableCell>{laptop.Processor}</TableCell>
                <TableCell>{laptop.RAM}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryLaptop;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography
} from '@mui/material';

const InventoryScreen = () => {
  const [screens, setScreens] = useState([]);
// const BASE_URL ="http://localhost:8000/api";
const BASE_URL= "http://10.2.0.2:8000/api";
  const fetchScreens = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllInventoryScreens`); // Adjust URL if needed
      setScreens(res.data.data);
    } catch (error) {
      console.error('Error fetching screens:', error);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Inventory Screens</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Screen Size</TableCell>
              <TableCell>Ports</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {screens.map((screen) => (
              <TableRow key={screen.Inventory_Screens_ID}>
                <TableCell>{screen.Brand}</TableCell>
                <TableCell>{screen.Model}</TableCell>
                <TableCell>{screen.Screen_Size}</TableCell>
                <TableCell>{screen.Ports_}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryScreen;

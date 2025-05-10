import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DisplayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayValue = (value) => {
    return value !== undefined && value !== null && value !== '' ? value : 'Not Available';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/Get_Orders');
        setOrders(res.data.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={15} h={10}>
      <Typography variant="h4" gutterBottom>
      Information of Orders
      </Typography>

      {orders.map((order, idx) => (
        <Accordion key={idx} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <strong>Order No:</strong> {displayValue(order.Order_No)} | <strong>Type:</strong> {displayValue(order.Type)} | <strong>QTY:</strong> {displayValue(order.QTY)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {[
                  ['PKD_By', order.PKD_By],
                  ['Built_By', order.Built_By],
                  ['INS_By', order.INS_By],
                  ['Model', order.Model],
                  ['Brand', order.Brand],
                  ['SERIAL No', order.SERIAL_No],
                  ['Description', order.Description],
                  ['Hard Drive', order.Hard_Drive],
                  ['Ram', order.Ram],
                  ['OS', order.OS],
                  ['Cable', order.Cable],
                  ['KB & Mice', order.KB_Mice],
                  ['Prime', order.Prime],
                  ['Dispatched', order.Dispatched],
                  ['Labels', order.Labels],
                  ['Post Code', order.Post_Code],
                  ['Dispatch Date', order.Disp_Date],
                  ['MU', order.MU]
                ].map(([label, value], i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Typography variant="body2">
                      <strong>{label}:</strong> {displayValue(value)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DisplayOrders;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DisplayInventoryOrder = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayValue = (val) => (val !== undefined && val !== null && val !== '' ? val : 'Not Available');

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Get_Inventory_Order');
        setInventoryData(response.data.data); // 👈 Adjust based on your actual response structure
      } catch (error) {
        setError('Error fetching inventory order data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
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
    <Box p={15}>
      <Typography variant="h4" gutterBottom>
        Inventory & Order Details
      </Typography>

      {inventoryData.map((item, index) => (
        <Accordion key={index} component={Paper} elevation={2}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Model: <strong>{displayValue(item.Model)}</strong> | Brand: <strong>{displayValue(item.Brand)}</strong>
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                { label: 'Location', value: item.Location },
                { label: 'Brand', value: item.Brand },
                { label: 'Model', value: item.Model },
                { label: 'Processor', value: item.Processor },
                { label: 'RAM', value: `${item.RAM} GB` },
                { label: 'Hard Drive', value: `${item.Hard_Drive} GB` },
                { label: 'Form Factor', value: item.Form_Factor },
                { label: 'Type', value: item.Type },
                { label: 'Received', value: item.Received },
                { label: 'Available', value: item.Available },
                { label: 'Inventory ID', value: item.Inventory_ID },
                { label: 'Order ID', value: item.Order_ID },
              ].map((field, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Typography>
                    <strong>{field.label}:</strong> {displayValue(field.value)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DisplayInventoryOrder;

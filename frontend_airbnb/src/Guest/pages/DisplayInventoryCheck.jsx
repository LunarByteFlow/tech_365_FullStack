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

const DisplayInventoryCheck = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayValue = (val) => (val !== undefined && val !== null && val !== '' ? val : 'Not Available');

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('https://c1cb-86-22-227-192.ngrok-free.app/api/Get_Inventory_Check');
        setInventoryData(response.data.data); // 👈 Correct path to the array
      } catch (error) {
        setError('Error fetching inventory check data');
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
    <Box p={15} h={10}>
      <Typography variant="h4" gutterBottom>
        Inventory Check Details
      </Typography>

      {inventoryData.map((item, index) => (
        <Accordion key={index} component={Paper} elevation={2}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Order No: <strong>{displayValue(item.Order_No)}</strong> | Model: <strong>{displayValue(item.Model)}</strong>
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                { label: 'Quantity', value: item.QTY },
                { label: 'Brand', value: item.Brand },
                { label: 'Processor', value: item.Processor },
                { label: 'Serial Number', value: item.Serial_Number },
                { label: 'HDD', value: item.HDD },
                { label: 'RAM', value: `${item.RAM} GB` },
                { label: 'Date', value: item.Date },
                { label: 'Inventory Check ID', value: item.Inventory_CheckID },
                { label: 'Inventory ID', value: item.Inventory_ID },
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

export default DisplayInventoryCheck;

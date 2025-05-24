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
  Grow
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DisplayInventoryCheck = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const displayValue = (val) =>
    val !== undefined && val !== null && val !== '' ? val : 'Not Available';

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Get_Inventory_Check');
        setInventoryData(response.data.data);
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
    <Box px={{ xs: 3, sm: 10}} py={5}>
      <Typography variant="h4" gutterBottom fontWeight={600} h={40} textAlign="center">
        📦 Inventory Check Details
      </Typography>

      {inventoryData.map((item, index) => (
        <Grow in timeout={500 + index * 100} key={index}>
          <Accordion
            component={Paper}
            elevation={3}
            sx={{
              my: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              ':hover': {
                boxShadow: 6,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                transition: 'background-color 0.2s ease',
                ':hover': {
                  backgroundColor: '#e3f2fd',
                },
              }}
            >
              <Typography fontWeight={500}>
                📝 Order No: <strong>{displayValue(item.Order_No)}</strong> | Model:{' '}
                <strong>{displayValue(item.Model)}</strong>
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 4, py: 3 }}>
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
        </Grow>
      ))}
    </Box>
  );
};

export default DisplayInventoryCheck;

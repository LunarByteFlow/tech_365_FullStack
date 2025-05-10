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

const DisplayDispatch = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayValue = (val) => (val !== undefined && val !== null && val !== '' ? val : 'Not Available');

  useEffect(() => {
    const fetchDispatchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Get_Dispatch');
        setDispatchData(response.data.data);
      } catch (error) {
        setError('Error fetching dispatch data');
      } finally {
        setLoading(false);
      }
    };

    fetchDispatchData();
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
        Information of Dispatch Orders
      </Typography>

      {dispatchData.map((dispatch, index) => (
        <Accordion key={index} component={Paper} elevation={2}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Order No: <strong>{displayValue(dispatch.Order_No)}</strong> | Model: <strong>{displayValue(dispatch.Model)}</strong>
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                { label: 'Type', value: dispatch.Type },
                { label: 'Quantity', value: dispatch.QTY },
                { label: 'Brand', value: dispatch.Brand },
                { label: 'Serial No', value: dispatch.Serial_No },
                { label: 'Cable', value: dispatch.Cable },
                { label: 'Accessories', value: dispatch.Accessories },
                { label: 'Label', value: dispatch.Label },
                { label: 'Post Code', value: dispatch.Post_Code },
                { label: 'Date', value: dispatch.Date },
                { label: 'Dispatch ID', value: dispatch.Dispatch_ID },
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Typography>
                    <strong>{item.label}:</strong> {displayValue(item.value)}
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

export default DisplayDispatch;

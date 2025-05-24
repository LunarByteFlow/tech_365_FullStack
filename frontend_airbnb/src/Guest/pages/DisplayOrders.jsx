import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DisplayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Simplified displayValue function
  const displayValue = (value) => value || "Not Available";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `https://tech-365-full-stack.vercel.app/api/Get_Orders`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log("API Status Code:", res.status);
        console.log("API Response:", res.data);

        // Ensure we set an array even if data structure changes
        const fetchedOrders = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setOrders(fetchedOrders);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
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
    <Box p={6} gutterBottom sx={{ mb: 4 }} mt={10}>
      <Typography variant="h4">Information of Orders</Typography>

      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order) => (
          <Accordion key={order.Order_No} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                <strong>Order No:</strong> {displayValue(order.Order_No)} |{" "}
                <strong>Type:</strong> {displayValue(order.Type)} |{" "}
                <strong>QTY:</strong> {displayValue(order.QTY)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {[
                    ["PKD_By", order.PKD_By],
                    ["Built_By", order.Built_By],
                    ["INS_By", order.INS_By],
                    ["Model", order.Model],
                    ["Brand", order.Brand],
                    ["SERIAL No", order.SERIAL_No],
                    ["Description", order.Description],
                    ["Hard Drive", order.Hard_Drive],
                    ["Ram", order.Ram],
                    ["OS", order.OS],
                    ["Cable", order.Cable],
                    ["KB & Mice", order.KB_Mice],
                    ["Prime", order.Prime],
                    ["Dispatched", order.Dispatched],
                    ["Labels", order.Labels],
                    ["Post Code", order.Post_Code],
                    ["Dispatch Date", order.Disp_Date],
                    ["MU", order.MU],
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
        ))
      ) : (
        <Typography>No orders found.</Typography>
      )}
    </Box>
  );
};

export default DisplayOrders;

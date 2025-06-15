import React, { useEffect, useState } from "react";
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
  // const BASE_URL = "http://localhost:8000/api";
  const BASE_URL= "http://10.2.0.2:8000/api";

  const getCourierColor = (courier) => {
    if (!courier) return "gray";
    switch (courier.toUpperCase()) {
      case "DHL":
        return "lightgreen";
      case "RM":
      case "ROYAL MAIL":
        return "lightyellow";
      case "DPD":
        return "lightcoral"; // light red
      default:
        return "lightgray";
    }
  };

  const displayValue = (value) => value || "Not Available";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/Get_Orders`, {
          headers: {
            Accept: "application/json",
          },
        });
        console.log("API Status Code:", res.status);
        console.log("API Response:", res.data);

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
                    ["PackedBy", order.PackedBy],
                    ["BuiltBy", order.BuiltBy],
                    ["InstallBy", order.InstallBy],
                    ["ItemType", order.ItemType],
                    ["OrderNo", order.OrderNo],
                    ["QTY", order.QTY],
                    ["Model", order.Model],
                    ["Brand", order.Brand],
                    ["SERIAL No", order.SERIAL_No],
                    ["Processor", order.Processor],
                    ["RAM", order.RAM],
                    ["Hard Drive", order.HardDrive],
                    ["OS", order.OS],
                    ["Cable", order.Cable],
                    ["Comment", order.Comment],
                    [
                      "Courier",
                      <span
                        style={{
                          backgroundColor: getCourierColor(order.Courier),
                          color: "black",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          display: "inline-block",
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                        key="courier-color"
                      >
                        {displayValue(order.Courier)}
                      </span>,
                    ],
                    ["Dispatched", order.Dispatched],
                    ["OrderID", order.OrderID],
                    ["PostCode", order.PostCode],
                    ["Dispatch Date", order.DispatchDate],
                    ["Prebuilt Or Inventory", order.Prebuilt_Or_Inventory],
                  ].map(([label, value], i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Typography variant="body2">
                        <strong>{label}:</strong> {value}
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

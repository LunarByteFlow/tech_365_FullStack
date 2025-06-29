import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BASE_URL = "http://10.2.0.2:8000/api";

const displayValue = (value) => (value === null || value === undefined || value === "" ? "Not Available" : value);

const initialFormState = {
  PackedBy: "",
  BuiltBy: "",
  InstallBy: "",
  ItemType: "",
  OrderNo: "",
  QTY: "",
  Model: "",
  Brand: "",
  SERIALNo: "",
  Processor: "",
  RAM: "",
  HardDrive: "",
  OS: "",
  Cable: "",
  Comment: "",
  Courier: "",
  Dispatched: "",
  OrderID: "",
  PostCode: "",
  DispatchDate: "",
  Prebuilt_Or_Inventory: "",
};

const DisplayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/Get_Orders`);
      const fetchedOrders = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrder = async () => {
    try {
      const { OrderSheet_ID, ...payload } = formData;
      const res = await axios.post(`${BASE_URL}/AddOrder`, payload);
      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");
        setIsAddOpen(false);
        setFormData(initialFormState);
        fetchOrders();
      } else {
        Swal.fire("Error", res.data.message || "Failed to add order", "error");
      }
    } catch {
      Swal.fire("Error", "Failed to add order", "error");
    }
  };

  const handleOpenEdit = (order) => {
    setFormData({ ...order, QTY: order.QTY?.toString() || "" });
    setIsEditOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!formData.OrderNo) {
      Swal.fire("Validation error", "OrderNo is required for update", "warning");
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/update_order`, formData);
      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");
        setIsEditOpen(false);
        setFormData(initialFormState);
        fetchOrders();
      } else {
        Swal.fire("Error", res.data.message || "Failed to update order", "error");
      }
    } catch {
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${BASE_URL}/Delete_OrderById/${id}`);
          if (res.data.success) {
            Swal.fire("Deleted!", res.data.message, "success");
            fetchOrders();
          } else {
            Swal.fire("Error", res.data.message || "Failed to delete order", "error");
          }
        } catch {
          Swal.fire("Error", "Failed to delete order", "error");
        }
      }
    });
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios.post(`${BASE_URL}/upload_csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success");
        fetchOrders();
      } else {
        Swal.fire("Error", response.data.message || "Failed to upload CSV", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload CSV due to network error.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  // --- Start of corrected rendering logic ---

  // Show loading spinner if data is being fetched
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message if fetching failed (but still display buttons below)
  if (error) {
    return (
      <Box p={4} sx={{ mt: 10 }}> {/* Add mt to ensure it's below any fixed header if applicable */}
        <Alert severity="error">{error}</Alert>
        {/*
          IMPORTANT: The buttons should be rendered here too if you want them
          to be available even when there's an error. If the error is critical
          and you don't want any interaction, then remove this Box.
        */}
        <Box display="flex" alignItems="center" mb={4} mt={2}>
          <Button variant="contained" color="primary" onClick={() => setIsAddOpen(true)}>
            Add New Order
          </Button>
          <Button variant="outlined" component="label" sx={{ ml: 2 }}>
            Upload CSV
            <input type="file" accept=".csv" hidden onChange={handleCSVUpload} />
          </Button>
        </Box>
      </Box>
    );
  }

  // Once loading is complete and no critical error, render the main content
  return (
    <Box p={6} sx={{ mb: 4 }} mt={10}>
      <Typography variant="h4" mb={4}>Information of Orders</Typography>

      {/* This Box is now OUTSIDE of any 'orders.length' conditional logic */}
      <Box display="flex" alignItems="center" mb={4}>
        <Button variant="contained" color="primary" onClick={() => setIsAddOpen(true)}>
          Add New Order
        </Button>
        <Button variant="outlined" component="label" sx={{ ml: 2 }}>
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleCSVUpload} />
        </Button>
      </Box>

      {/* Conditional rendering for the list of orders or "No orders found" message */}
      {orders.length > 0 ? (
        orders.map((order) => (
          <Accordion key={order.OrderSheet_ID || order.OrderNo}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1 }}>
                <strong>Order No:</strong> {displayValue(order.OrderNo)} | <strong>Type:</strong> {displayValue(order.ItemType)} | <strong>QTY:</strong> {displayValue(order.QTY)}
              </Typography>
              <Box>
                <IconButton onClick={() => handleOpenEdit(order)} color="primary" size="small" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(order.OrderSheet_ID)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {Object.entries(order).map(([label, value], i) => (
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
        <Typography>No orders found. Add a new order or upload via CSV.</Typography>
      )}

      {[isAddOpen, isEditOpen].map((open, index) => (
        <Dialog open={open} onClose={() => (index === 0 ? setIsAddOpen(false) : setIsEditOpen(false))} maxWidth="md" fullWidth key={index}>
          <DialogTitle>{index === 0 ? "Add New Order" : "Edit Order"}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {(index === 0
                ? Object.keys(initialFormState)
                : [...Object.keys(initialFormState), "OrderSheet_ID"]
              ).map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    label={field}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    type={field === "QTY" ? "number" : "text"}
                    multiline={field === "Comment"}
                    rows={field === "Comment" ? 3 : 1}
                    InputProps={{ readOnly: field === "OrderSheet_ID" }}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => (index === 0 ? setIsAddOpen(false) : setIsEditOpen(false))}>Cancel</Button>
            <Button variant="contained" onClick={index === 0 ? handleAddOrder : handleUpdateOrder}>
              {index === 0 ? "Add Order" : "Update Order"}
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </Box>
  );
};

export default DisplayOrders;
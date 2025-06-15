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
  // Note: Removed OrderSheet_ID from initial state
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
    if (!formData.OrderNo || !formData.Model || !formData.Brand || !formData.SERIALNo) {
      Swal.fire("Validation error", "OrderNo, Model, Brand and SERIALNo are required", "warning");
      return;
    }

    try {
      const { OrderSheet_ID, ...payload } = formData; // Strip out if accidentally present
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
          const res = await axios.get(`${BASE_URL}/Delete_OrderById/${id}`);
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
    <Box p={6} sx={{ mb: 4 }} mt={10}>
      <Typography variant="h4" mb={4}>Information of Orders</Typography>
      <Button variant="contained" color="primary" onClick={() => setIsAddOpen(true)} sx={{ mb: 4 }}>
        Add New Order
      </Button>

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
        <Typography>No orders found.</Typography>
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";

import { supabase } from "../../supabase/SupabaseClient";
// Replace with your real backend URL
const BASE_URL = "http://10.2.0.2:8000/api";

const emptyDesktop = {
  Built_By: "",
  Install_By: "",
  Item_Type: "",
  QTY: "",
  Model: "",
  Brand: "",
  SERIAL_NO: "",
  Processor: "",
  RAM: "",
  Hard_Drive: "",
  OS: "",
  PreB_Desk_Location: "",
};

const PrebuiltDesktops = () => {
  const [desktops, setDesktops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDesktop, setEditingDesktop] = useState(null);
  const [formData, setFormData] = useState(emptyDesktop);

  // const fetch_Inventory_Desktops = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`${BASE_URL}/GetAllPrebuiltDesktops`);
  //     setDesktops(res.data.success ? res.data.data : []);
  //   } catch (error) {
  //     console.error("Error fetching desktops:", error);
  //     setDesktops([]);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetch_Inventory_Desktops();
  // }, []);

  const fetch_Inventory_Desktops = async () => {
    setLoading(true);
    try {
      // Supabase: SELECT * FROM your_table_name
      // Replace 'your_table_name' with your actual Supabase table name.
      const { data, error } = await supabase.from("Prebuilt_Desktops").select("*");
      if (error) {
        throw new Error(error.message);
      }
      setDesktops(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch_Inventory_Desktops();
  }, []);

  const handleOpenDialog = (desktop = null) => {
    setEditingDesktop(desktop);
    setFormData(desktop || emptyDesktop);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDesktop(null);
    setFormData(emptyDesktop);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.Model || !formData.Brand || !formData.SERIAL_NO) {
      alert("Model, Brand, and Serial No. are required.");
      return;
    }

    try {
      // Remove Prebuilt_ID from payload
      const { Prebuilt_ID, Prebuilt_Desktops_ID, ...payload } = formData;

      if (editingDesktop) {
        await axios.put(
          `${BASE_URL}/UpdatePrebuiltDesktop/${editingDesktop.Prebuilt_Desktops_ID}`,
          payload
        );
      } else {
        await axios.post(`${BASE_URL}/CreatePrebuiltDesktop`, payload);
      }

      fetch_Inventory_Desktops();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving desktop:", error);
      alert("Failed to save desktop. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this desktop?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/DeletePrebuiltDesktop/${id}`);
      fetch_Inventory_Desktops();
    } catch (error) {
      console.error("Error deleting desktop:", error);
      alert("Failed to delete desktop.");
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prebuilt Desktops Inventory
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2 }}
      >
        Add New Desktop
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Serial No.</TableCell>
              <TableCell>QTY</TableCell>
              <TableCell>Processor</TableCell>
              <TableCell>RAM</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && desktops.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No desktops found.
                </TableCell>
              </TableRow>
            )}
            {desktops.map((desktop) => (
              <TableRow key={desktop.Prebuilt_Desktops_ID}>
                <TableCell>{desktop.Model}</TableCell>
                <TableCell>{desktop.Brand}</TableCell>
                <TableCell>{desktop.SERIAL_NO}</TableCell>
                <TableCell>{desktop.QTY}</TableCell>
                <TableCell>{desktop.Processor}</TableCell>
                <TableCell>{desktop.RAM}</TableCell>
                <TableCell>{desktop.PreB_Desk_Location}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenDialog(desktop)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(desktop.Prebuilt_Desktops_ID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingDesktop ? "Edit Desktop" : "Add New Desktop"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { label: "Model", name: "Model" },
              { label: "Brand", name: "Brand" },
              { label: "Serial No.", name: "SERIAL_NO" },
              { label: "QTY", name: "QTY", type: "number" },
              { label: "Processor", name: "Processor" },
              { label: "RAM", name: "RAM" },
              { label: "Hard Drive", name: "Hard_Drive" },
              { label: "Operating System", name: "OS" },
              { label: "Built By", name: "Built_By" },
              { label: "Install By", name: "Install_By" },
              { label: "Item Type", name: "Item_Type" },
              { label: "Location", name: "PreB_Desk_Location" },
            ].map(({ label, name, type = "text" }) => (
              <Grid item xs={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingDesktop ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PrebuiltDesktops;

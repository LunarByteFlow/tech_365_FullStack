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

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL= "http://10.2.0.2:8000/api";

const emptyDesktop = {
  Prebuilt_ID: "",
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
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDesktop, setEditingDesktop] = useState(null);
  const [formData, setFormData] = useState(emptyDesktop);

  // Fetch all desktops
  const fetchDesktops = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/GetAllPrebuiltDesktops`);
      if (res.data.success) {
        setDesktops(res.data.data);
      } else {
        setDesktops([]);
      }
    } catch (error) {
      console.error("Error fetching desktops:", error);
      setDesktops([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDesktops();
  }, []);

  // Open dialog for add or edit
  const handleOpenDialog = (desktop = null) => {
    if (desktop) {
      setEditingDesktop(desktop);
      setFormData(desktop);
    } else {
      setEditingDesktop(null);
      setFormData(emptyDesktop);
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDesktop(null);
    setFormData(emptyDesktop);
  };

  // Handle input change in form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form to create or update
  const handleSubmit = async () => {
    // Validation (basic)
    if (!formData.Model || !formData.Brand || !formData.SERIAL_NO) {
      alert("Model, Brand, and Serial No. are required.");
      return;
    }

    try {
      if (editingDesktop) {
        // Update existing desktop
        await axios.put(
          `${BASE_URL}/UpdatePrebuiltDesktop/${editingDesktop.Prebuilt_Desktops_ID}`,
          formData
        );
      } else {
        // Create new desktop
        await axios.post(`${BASE_URL}/CreatePrebuiltDesktop`, formData);
      }
      fetchDesktops();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving desktop:", error);
      alert("Failed to save desktop. Check console for details.");
    }
  };

  // Delete desktop
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this desktop?")) return;

    try {
      await axios.delete(`${BASE_URL}/DeletePrebuiltDesktop/${id}`);
      fetchDesktops();
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
      <Button variant="contained" onClick={() => handleOpenDialog(null)} sx={{ mb: 2 }}>
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

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingDesktop ? "Edit Desktop" : "Add New Desktop"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Model"
                name="Model"
                value={formData.Model}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Brand"
                name="Brand"
                value={formData.Brand}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Serial No."
                name="SERIAL_NO"
                value={formData.SERIAL_NO}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="QTY"
                name="QTY"
                type="number"
                value={formData.QTY}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Processor"
                name="Processor"
                value={formData.Processor}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="RAM"
                name="RAM"
                value={formData.RAM}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Hard Drive"
                name="Hard_Drive"
                value={formData.Hard_Drive}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Operating System"
                name="OS"
                value={formData.OS}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Built By"
                name="Built_By"
                value={formData.Built_By}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Install By"
                name="Install_By"
                value={formData.Install_By}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Item Type"
                name="Item_Type"
                value={formData.Item_Type}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Location"
                name="PreB_Desk_Location"
                value={formData.PreB_Desk_Location}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Prebuilt ID"
                name="Prebuilt_ID"
                type="number"
                value={formData.Prebuilt_ID}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
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

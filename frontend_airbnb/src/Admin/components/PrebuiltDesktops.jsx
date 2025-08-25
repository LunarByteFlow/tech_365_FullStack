import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
import axios from "axios";
import { supabase } from "../../supabase/SupabaseClient";

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

  const USE_SUPABASE = true;

  const fetchDesktops = async () => {
    setLoading(true);
    try {
      if (USE_SUPABASE) {
        const { data, error } = await supabase
          .from("Prebuilt_Desktops")
          .select("*");
        if (error) throw error;
        setDesktops(data);
      } else {
        const res = await axios.get(`${BASE_URL}/GetAllPrebuiltDesktops`);
        setDesktops(res.data.success ? res.data.data : []);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch desktops");
      setDesktops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesktops();
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.Model || !formData.Brand || !formData.SERIAL_NO) {
      Swal.fire("Error", "Model, Brand, and Serial No. are required.", "error");
      return;
    }

    try {
      const payload = { ...formData };
      if (editingDesktop) {
        if (USE_SUPABASE) {
          await supabase
            .from("Prebuilt_Desktops")
            .update(payload)
            .eq("Prebuilt_Desktops_ID", editingDesktop.Prebuilt_Desktops_ID);
        } else {
          await axios.put(
            `${BASE_URL}/UpdatePrebuiltDesktop/${editingDesktop.Prebuilt_Desktops_ID}`,
            payload
          );
        }
        Swal.fire("Updated!", "Desktop inventory updated successfully.", "success");
      } else {
        if (USE_SUPABASE) {
          await supabase.from("Prebuilt_Desktops").insert([payload]);
        } else {
          await axios.post(`${BASE_URL}/CreatePrebuiltDesktop`, payload);
        }
        Swal.fire("Added!", "Desktop inventory added successfully.", "success");
      }

      fetchDesktops();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to save desktop. Check console for details.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      if (USE_SUPABASE) {
        await supabase
          .from("Prebuilt_Desktops")
          .delete()
          .eq("Prebuilt_Desktops_ID", id);
      } else {
        await axios.delete(`${BASE_URL}/DeletePrebuiltDesktop/${id}`);
      }
      Swal.fire("Deleted!", "Desktop inventory has been deleted.", "success");
      fetchDesktops();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete desktop.", "error");
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingDesktop ? "Edit Desktop" : "Add New Desktop"}</DialogTitle>
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

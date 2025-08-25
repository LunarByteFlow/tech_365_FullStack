import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { supabase } from "../../supabase/SupabaseClient";

const emptyLaptop = {
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
  Screen_Size: "",
  Resolution: "",
  Location_: "",
};

const PrebuiltLaptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [formData, setFormData] = useState(emptyLaptop);
  const [loading, setLoading] = useState(true);

  const fetchLaptops = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Prebuilt_Laptops").select("*");
      if (error) throw error;
      setLaptops(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch laptops from Supabase", "error");
      setLaptops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleOpenDialog = (laptop = null) => {
    setEditingLaptop(laptop);
    setFormData(laptop || emptyLaptop);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLaptop(null);
    setFormData(emptyLaptop);
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
      if (editingLaptop) {
        await supabase
          .from("Prebuilt_Laptops")
          .update(formData)
          .eq("Prebuilt_Laptops_ID", editingLaptop.Prebuilt_Laptops_ID);
        Swal.fire("Updated!", "Laptop updated successfully.", "success");
      } else {
        await supabase.from("Prebuilt_Laptops").insert([formData]);
        Swal.fire("Added!", "Laptop added successfully.", "success");
      }
      fetchLaptops();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save laptop in Supabase", "error");
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
      await supabase.from("Prebuilt_Laptops").delete().eq("Prebuilt_Laptops_ID", id);
      Swal.fire("Deleted!", "Laptop has been deleted.", "success");
      fetchLaptops();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete laptop from Supabase", "error");
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prebuilt Laptops Inventory
      </Typography>
      <Button variant="contained" onClick={() => handleOpenDialog(null)} sx={{ mb: 2 }}>
        Add New Laptop
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && laptops.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No laptops found.
                </TableCell>
              </TableRow>
            )}
            {laptops.map((laptop) => (
              <TableRow key={laptop.Prebuilt_Laptops_ID}>
                <TableCell>{laptop.Model}</TableCell>
                <TableCell>{laptop.Brand}</TableCell>
                <TableCell>{laptop.SERIAL_NO}</TableCell>
                <TableCell>{laptop.QTY}</TableCell>
                <TableCell>{laptop.Processor}</TableCell>
                <TableCell>{laptop.RAM}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenDialog(laptop)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(laptop.Prebuilt_Laptops_ID)}
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
        <DialogTitle>{editingLaptop ? "Edit Laptop" : "Add New Laptop"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.keys(emptyLaptop).map((key) => (
              <Grid item xs={6} key={key}>
                <TextField
                  label={key.replace(/_/g, " ")}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  fullWidth
                  required={["Model", "Brand", "SERIAL_NO"].includes(key)}
                  type={key === "QTY" ? "number" : "text"}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingLaptop ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PrebuiltLaptops;

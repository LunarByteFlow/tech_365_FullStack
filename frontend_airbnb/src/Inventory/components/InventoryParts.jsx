import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL = "http://10.2.0.2:8000/api";

const InventoryParts = () => {
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  const tableHeaders = [
    "Facility",
    "Location",
    "Brand",
    "Model",
    "Type_",
    "Comments",
    "QTY_Recieved",
    "QTY_On_Hand",
  ];

  const fetchParts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllPartInventory`);
      setParts(res.data.data);
      setFilteredParts(res.data.data);
    } catch (error) {
      setError("Failed to fetch parts");
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRow({ ...filteredParts[index] });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedRow({});
  };

  const handleChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${BASE_URL}/Update_PartInventory/${id}`, editedRow);
      const updated = [...parts];
      const updatedIndex = parts.findIndex((p) => p.Inventory_Parts_ID === id);
      updated[updatedIndex] = editedRow;
      setParts(updated);
      applyFilters(filters, updated);
      setEditIndex(null);
      setEditedRow({});
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters, parts);
  };

  const applyFilters = (filtersObj, data) => {
    let filtered = data.filter((item) =>
      Object.keys(filtersObj).every((key) => {
        const filterValue = filtersObj[key].toLowerCase();
        return item[key]?.toString().toLowerCase().includes(filterValue);
      })
    );
    setFilteredParts(filtered);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Part Inventory
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>
                    {header.replace(/_/g, " ").replace("QTY", "Quantity")}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>

              {/* Filter Row */}
              <TableRow>
                {tableHeaders.map((field) => (
                  <TableCell key={`filter-${field}`}>
                    <TextField
                      size="small"
                      placeholder="Filter"
                      variant="outlined"
                      value={filters[field] || ""}
                      onChange={(e) =>
                        handleFilterChange(field, e.target.value)
                      }
                      fullWidth
                    />
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredParts.map((part, index) => (
                <TableRow key={part.Inventory_Parts_ID}>
                  {tableHeaders.map((field) => (
                    <TableCell key={field}>
                      {editIndex === index ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={editedRow[field] || ""}
                          onChange={(e) =>
                            handleChange(field, e.target.value)
                          }
                          fullWidth
                        />
                      ) : (
                        part[field]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editIndex === index ? (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() =>
                            handleSave(part.Inventory_Parts_ID)
                          }
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default InventoryParts;

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const InventoryAO = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const BASE_URL = "http://10.2.0.2:8000/api";

  const tableHeaders = [
    "Facility",
    "Location_",
    "Brand",
    "Model",
    "Screen_Size",
    "Processor",
    "RAM",
    "Hard_Drive",
    "Stand",
    "QTY_Recieved",
    "QTY_On_Hand",
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterValues, inventoryList]);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/Get_Inventory`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      if (data.success) {
        setInventoryList(data.data);
      } else {
        setInventoryList([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = inventoryList.filter((item) =>
      tableHeaders.every((header) => {
        const filterVal = filterValues[header];
        if (!filterVal) return true;
        const itemValue = item[header];
        return itemValue
          ? itemValue.toString().toLowerCase().includes(filterVal.toLowerCase())
          : false;
      })
    );
    setFilteredInventory(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRow({ ...filteredInventory[index] });
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
      const res = await fetch(`${BASE_URL}/Update_Inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRow),
      });
      if (!res.ok) throw new Error("Failed to update inventory");

      // Update the original inventoryList with editedRow
      const updatedList = [...inventoryList];
      const originalIndex = inventoryList.findIndex(
        (item) => item.InventoryAO_ID === id
      );
      if (originalIndex !== -1) {
        updatedList[originalIndex] = editedRow;
        setInventoryList(updatedList);
      }

      setEditIndex(null);
      setEditedRow({});
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        AO Inventory List
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
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              {/* Filter Row */}
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder={`Search ${header.replace(/_/g, " ")}`}
                      value={filterValues[header] || ""}
                      onChange={(e) =>
                        handleFilterChange(header, e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: filterValues[header] && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => handleFilterChange(header, "")}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                ))}
                <TableCell>{/* Actions column empty for filter row */}</TableCell>
              </TableRow>

              {/* Header Row */}
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>
                    {header.replace(/_/g, " ").replace("QTY", "Quantity ")}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item, index) => (
                <TableRow key={item.InventoryAO_ID}>
                  {tableHeaders.map((field) => (
                    <TableCell key={field}>
                      {editIndex === index ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={editedRow[field] || ""}
                          onChange={(e) => handleChange(field, e.target.value)}
                          fullWidth
                        />
                      ) : (
                        item[field]
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
                          onClick={() => handleSave(item.InventoryAO_ID)}
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
    </Container>
  );
};

export default InventoryAO;

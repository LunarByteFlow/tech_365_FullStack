import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const InventoryDesktops = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const BASE_URL = "http://10.2.0.2:8000/api";

  const tableHeaders = [
    "Location_",
    "Brand",
    "Model",
    "Type_",
    "Processor",
    "RAM",
    "Hard_Drive",
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
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${BASE_URL}/Get_AllDesktopInventory`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch inventory.");
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInventoryList(data.data);
      } else {
        setInventoryList([]);
        setMessage(data.message || "No desktop inventory records found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value.toLowerCase() }));
  };

  const applyFilters = () => {
    const filtered = inventoryList.filter((item) =>
      tableHeaders.every((header) => {
        const filterVal = filterValues[header];
        return (
          !filterVal ||
          item[header]?.toString().toLowerCase().includes(filterVal)
        );
      })
    );
    setFilteredList(filtered);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedRow({ ...filteredList[index] });
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedRow({});
  };

  const handleSaveClick = async () => {
    try {
      // Optionally, send the update to the backend:
      const res = await fetch(
        `${BASE_URL}/Update_DesktopInventory/${editedRow.Inventory_Desktops_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedRow),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update record.");
      }

      const updatedList = [...inventoryList];
      const originalIndex = inventoryList.findIndex(
        (item) => item.Inventory_Desktops_ID === editedRow.Inventory_Desktops_ID
      );
      updatedList[originalIndex] = editedRow;
      setInventoryList(updatedList);
      setMessage("Desktop inventory updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setEditIndex(null);
      setEditedRow({});
    }
  };

  const handleEditChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Desktop Inventory List
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, textAlign: "center" }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2, textAlign: "center" }}>
          {message}
        </Alert>
      )}

      {!loading && filteredList.length === 0 ? (
        <Typography align="center" color="textSecondary" mt={2}>
          No desktop inventory records found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              {/* Header Row: Just column titles */}
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>
                    {header.replace(/_/g, " ").replace("QTY", "Quantity")}
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>

              {/* Filter Inputs Row */}
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>
                    <TextField
                      label={`Filter ${header
                        .replace(/_/g, " ")
                        .replace("QTY", "Quantity")}`}
                      variant="standard"
                      fullWidth
                      onChange={(e) =>
                        handleFilterChange(header, e.target.value)
                      }
                      value={filterValues[header] || ""}
                    />
                  </TableCell>
                ))}
                <TableCell>{/* empty cell for actions column */}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredList.map((item, index) => (
                <TableRow key={item.Inventory_Desktops_ID}>
                  {tableHeaders.map((field) => (
                    <TableCell key={field}>
                      {editIndex === index ? (
                        <TextField
                          value={editedRow[field] || ""}
                          onChange={(e) =>
                            handleEditChange(field, e.target.value)
                          }
                          variant="standard"
                          fullWidth
                        />
                      ) : (
                        item[field]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editIndex === index ? (
                      <Stack direction="row" spacing={1}>
                        <IconButton color="success" onClick={handleSaveClick}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton color="error" onClick={handleCancelClick}>
                          <CancelIcon />
                        </IconButton>
                      </Stack>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(index)}
                      >
                        <EditIcon />
                      </IconButton>
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

export default InventoryDesktops;

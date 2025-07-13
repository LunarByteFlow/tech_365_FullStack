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
  IconButton,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const InventoryScreen = () => {
  const [screens, setScreens] = useState([]);
  const [filteredScreens, setFilteredScreens] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  const BASE_URL = "http://10.2.0.2:8000/api";

  const tableHeaders = [
    "Location",
    "Brand",
    "Model",
    "Screen_Size",
    "Ports_",
    "Stand",
    "QTY_Recieved",
    "QTY_On_Hand",
  ];

  useEffect(() => {
    fetchScreens();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterValues, screens]);

  const fetchScreens = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllInventoryScreens`);
      setScreens(res.data.data);
    } catch (error) {
      console.error("Error fetching screens:", error);
    }
  };

  const applyFilters = () => {
    const filtered = screens.filter((item) =>
      tableHeaders.every((header) => {
        const filterVal = filterValues[header];
        return (
          !filterVal ||
          item[header]?.toString().toLowerCase().includes(filterVal)
        );
      })
    );
    setFilteredScreens(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value.toLowerCase() }));
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedRow({ ...filteredScreens[index] });
  };

  const handleSaveClick = async () => {
    const confirmSave = window.confirm(
      "Are you sure you want to save the changes?"
    );
    if (!confirmSave) return;

    try {
      await axios.put(
        `${BASE_URL}/Update_InventoryScreen/${editedRow.Inventory_Screens_ID}`,
        editedRow,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the original screens state to reflect changes
      const updatedList = [...screens];
      const originalIndex = screens.findIndex(
        (item) => item.Inventory_Screens_ID === editedRow.Inventory_Screens_ID
      );
      updatedList[originalIndex] = editedRow;
      setScreens(updatedList);

      // Reset edit state
      setEditIndex(null);
      setEditedRow({});
    } catch (error) {
      console.error("Error updating screen:", error);
      alert("Failed to update the record. Please try again.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Inventory Screens
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/* Filter Row */}
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder={`Search ${header}`}
                    value={filterValues[header] || ""}
                    onChange={(e) => handleFilterChange(header, e.target.value)}
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
              <TableCell>{/* Empty cell for actions column */}</TableCell>
            </TableRow>

            {/* Header Row */}
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredScreens.map((screen, index) => (
              <TableRow key={screen.Inventory_Screens_ID}>
                {tableHeaders.map((field) => (
                  <TableCell key={field}>
                    {editIndex === index ? (
                      <TextField
                        value={editedRow[field] || ""}
                        onChange={(e) => handleEditChange(field, e.target.value)}
                        variant="standard"
                      />
                    ) : (
                      screen[field]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editIndex === index ? (
                    <IconButton color="primary" onClick={handleSaveClick}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="secondary"
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
    </Paper>
  );
};

export default InventoryScreen;

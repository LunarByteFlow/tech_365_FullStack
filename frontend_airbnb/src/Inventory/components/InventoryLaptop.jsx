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

const InventoryLaptop = () => {
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const BASE_URL = "http://10.2.0.2:8000/api";

  const tableHeaders = [
    "Facility",

    "Location",
    "Brand",
    "Model",
    "Type",
    "Processor",
    "RAM",
    "Hard_Drive",
    "Screen_Size",
    "Resolution",
    "QTY_Recieved",
    "QTY_On_Hand",
  ];

  useEffect(() => {
    fetchLaptops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterValues, laptops]);

  const fetchLaptops = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllLaptopInventory`);
      setLaptops(res.data.data);
    } catch (error) {
      console.error("Error fetching laptops:", error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value.toLowerCase() }));
  };

  const applyFilters = () => {
    const filtered = laptops.filter((item) =>
      tableHeaders.every((header) => {
        const filterVal = filterValues[header];
        return (
          !filterVal ||
          item[header]?.toString().toLowerCase().includes(filterVal)
        );
      })
    );
    setFilteredLaptops(filtered);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedRow({ ...filteredLaptops[index] });
  };

  const handleSaveClick = async () => {
    const confirmSave = window.confirm(
      "Are you sure you want to save the changes?"
    );
    if (!confirmSave) return;

    try {
      await axios.put(
        `${BASE_URL}/Update_LaptopInventory/${editedRow.Inventory_Laptops_ID}`,
        editedRow, // Sending JSON
        {
          headers: {
            "Content-Type": "application/json", // 👈 required for JSON
          },
        }
      );

      const updatedList = [...laptops];
      const originalIndex = laptops.findIndex(
        (item) => item.Inventory_Laptops_ID === editedRow.Inventory_Laptops_ID
      );
      updatedList[originalIndex] = editedRow;
      setLaptops(updatedList);
      setEditIndex(null);
      setEditedRow({});
    } catch (error) {
      console.error("Error updating laptop:", error);
      alert("Failed to update the record. Please try again.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Laptop Inventory
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/* 🔍 Filter Row ABOVE Headers */}
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
              <TableCell>{/* Empty for Actions column */}</TableCell>
            </TableRow>

            {/* 📋 Table Headers */}
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* 📦 Table Body */}
          <TableBody>
            {filteredLaptops.map((laptop, index) => (
              <TableRow key={laptop.Inventory_Laptops_ID}>
                {tableHeaders.map((field) => (
                  <TableCell key={field}>
                    {editIndex === index ? (
                      <TextField
                        value={editedRow[field] || ""}
                        onChange={(e) =>
                          handleEditChange(field, e.target.value)
                        }
                        variant="standard"
                      />
                    ) : (
                      laptop[field]
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

export default InventoryLaptop;

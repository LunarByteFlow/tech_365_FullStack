// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Paper,
//   Chip,
// } from "@mui/material";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// const LowStockTable = () => {
//   const [items, setItems] = useState([]);
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchLowStock = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/GetLowStockItems");
//         setItems(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch data.");
//         setLoading(false);
//       }
//     };

//     fetchLowStock();
//   }, []);

//   const getChipColor = (available) => {
//     if (available <= 2) return "error";
//     if (available <= 5) return "warning";
//     return "success";
//   };

//   const filteredItems =
//     typeFilter === "All"
//       ? items
//       : items.filter((item) => item.Type === typeFilter);

//   const uniqueTypes = ["All", ...new Set(items.map((item) => item.Type))];

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         📦 Low Stock Inventory
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" mt={4}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         <>
//           <FormControl sx={{ mb: 3, width: 300 }}>
//             <InputLabel>Filter by Type</InputLabel>
//             <Select
//               value={typeFilter}
//               onChange={(e) => setTypeFilter(e.target.value)}
//               label="Filter by Type"
//             >
//               {uniqueTypes.map((type, idx) => (
//                 <MenuItem key={idx} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><b>Brand</b></TableCell>
//                   <TableCell><b>Model</b></TableCell>
//                   <TableCell><b>Processor</b></TableCell>
//                   <TableCell><b>RAM (GB)</b></TableCell>
//                   <TableCell><b>HDD (GB)</b></TableCell>
//                   <TableCell><b>Type</b></TableCell>
//                   <TableCell><b>Location</b></TableCell>
//                   <TableCell><b>Available</b></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredItems.map((item, idx) => (
//                   <TableRow
//                     key={idx}
//                     sx={{
//                       backgroundColor:
//                         item.Available <= 2 ? "#fdecea" : "inherit",
//                     }}
//                   >
//                     <TableCell>{item.Brand}</TableCell>
//                     <TableCell>{item.Model}</TableCell>
//                     <TableCell>{item.Processor}</TableCell>
//                     <TableCell>{item.RAM}</TableCell>
//                     <TableCell>{item.Hard_Drive}</TableCell>
//                     <TableCell>{item.Type}</TableCell>
//                     <TableCell>{item.Location}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={
//                           item.Available <= 2 ? (
//                             <>
//                               <WarningAmberIcon sx={{ mr: 0.5 }} fontSize="small" />
//                               {item.Available}
//                             </>
//                           ) : (
//                             item.Available
//                           )
//                         }
//                         color={getChipColor(item.Available)}
//                         variant="outlined"
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}
//     </Box>
//   );
// };
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const LowStockTable = () => {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/GetLowStockItems");
        setItems(response.data.lowStockItems || []);  // Updated here
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const getChipColor = (available) => {
    if (available <= 2) return "error";
    if (available <= 5) return "warning";
    return "success";
  };

  const filteredItems =
    typeFilter === "All"
      ? items
      : items.filter((item) => item.InventoryType === typeFilter);

  const uniqueTypes = ["All", ...new Set(items.map((item) => item.InventoryType))];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        📦 Low Stock Inventory
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <FormControl sx={{ mb: 3, width: 300 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Filter by Type"
            >
              {uniqueTypes.map((type, idx) => (
                <MenuItem key={idx} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Brand</b></TableCell>
                  <TableCell><b>Model</b></TableCell>
                  <TableCell><b>Type</b></TableCell>
                  <TableCell><b>Facility</b></TableCell>
                  <TableCell><b>Location</b></TableCell>
                  <TableCell><b>Available</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor: item.QTY_On_Hand <= 2 ? "#fdecea" : "inherit",
                    }}
                  >
                    <TableCell>{item.Brand}</TableCell>
                    <TableCell>{item.Model}</TableCell>
                    <TableCell>{item.InventoryType}</TableCell>
                    <TableCell>{item.Facility}</TableCell>
                    <TableCell>{item.Location_}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          item.QTY_On_Hand <= 2 ? (
                            <>
                              <WarningAmberIcon sx={{ mr: 0.5 }} fontSize="small" />
                              {item.QTY_On_Hand}
                            </>
                          ) : (
                            item.QTY_On_Hand
                          )
                        }
                        color={getChipColor(item.QTY_On_Hand)}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default LowStockTable;


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
  TextField,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "http://10.2.0.2:8000/api";

const initialFormState = {
  // Inventory_Screens_ID: "",
  Facility: "",
  Location: "",
  Brand: "",
  Model: "",
  Screen_Size: "",
  Ports_: "",
  Stand: "",
  QTY: "",
  Received: "",
  QTY_on_Hand: "",
};

const InventoryScreens = () => {
  const [screens, setScreens] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await axios.get(`${BASE_URL}/Get_AllInventoryScreens`);
      if (res.data.success) {
        setScreens(res.data.data || []);
      } else {
        setScreens([]);
        setMessage(res.data.message || "No screens found.");
      }
    } catch (err) {
      setError("Failed to fetch screens.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    try {
      let payload = { ...form };

      if (!editingId) {
        // Creating new screen
        if (!payload.Inventory_Screens_ID) {
          payload.Inventory_Screens_ID = uuidv4();
        }
        const res = await axios.post(
          `${BASE_URL}/Create_InventoryScreen`,
          payload
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Create failed");
        setMessage("Screen created successfully!");
      } else {
        // Updating existing screen
        const res = await axios.put(
          `${BASE_URL}/Update_InventoryScreen/${editingId}`,
          payload
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Update failed");
        setMessage("Screen updated successfully!");
      }

      fetchScreens();
      setForm(initialFormState);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Error submitting data.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.Inventory_Screens_ID);
    setForm({ ...item });
    setError(null);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError(null);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this screen?")) return;

    setError(null);
    setMessage(null);
    try {
      const res = await axios.delete(
        `${BASE_URL}/Delete_InventoryScreen/${id}`
      );
      if (!res.data.success)
        throw new Error(res.data.message || "Delete failed");
      setMessage("Screen deleted successfully!");
      fetchScreens();
    } catch (err) {
      setError(err.message || "Error deleting screen.");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        {editingId ? "Update Screen" : "Add New Screen"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Stack
        direction="row"
        spacing={3}
        flexWrap="wrap"
        rowGap={3}
        columnGap={3}
        sx={{ mb: 4 }}
      >
        {Object.keys(initialFormState).map((field) => {
          const label = field
            .replace(/_/g, " ")
            .replace("ID", "Id")
            .replace("Ports ", "Ports");
          return (
            <TextField
              key={field}
              label={label}
              name={field}
              value={form[field]}
              onChange={handleChange}
              disabled={field === "Inventory_Screens_ID" && editingId !== null}
              sx={{ flex: "1 1 220px", minWidth: 200 }}
              size="small"
            />
          );
        })}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={4}>
        {editingId && (
          <Button variant="outlined" color="error" onClick={handleCancelEdit}>
            Cancel Edit
          </Button>
        )}
        <Button variant="contained" onClick={handleSubmit}>
          {editingId ? "Update Screen" : "Create Screen"}
        </Button>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Screens Inventory List
      </Typography>

      {loading ? (
        <Stack alignItems="center" my={3}>
          <CircularProgress />
        </Stack>
      ) : screens.length === 0 ? (
        <Typography>No screens found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="screen inventory table">
            <TableHead>
              <TableRow>
                {Object.keys(initialFormState).map((header) => (
                  <TableCell key={header}>
                    {header.replace(/_/g, " ")}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {screens.map((item) => (
                <TableRow key={item.Inventory_Screens_ID}>
                  {Object.keys(initialFormState).map((field) => (
                    <TableCell key={field}>{item[field]}</TableCell>
                  ))}
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.Inventory_Screens_ID)}
                    >
                      Delete
                    </Button>
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

export default InventoryScreens;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Stack,
//   Alert,
//   CircularProgress,
// } from "@mui/material";

// const BASE_URL = "http://10.2.0.2:8000/api";

// const initialFormState = {
//   Brand: "",
//   Model: "",
//   Screen_Size: "",
//   Ports_: "",
// };

// const InventoryScreens = () => {
//   const [screens, setScreens] = useState([]);
//   const [form, setForm] = useState(initialFormState);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     fetchScreens();
//   }, []);

//   const fetchScreens = async () => {
//     setLoading(true);
//     setError(null);
//     setMessage(null);
//     try {
//       const res = await axios.get(`${BASE_URL}/Get_AllInventoryScreens`);
//       if (res.data.success) {
//         setScreens(res.data.data || []);
//       } else {
//         setScreens([]);
//         setMessage(res.data.message || "No screens found.");
//       }
//     } catch (err) {
//       setError("Failed to fetch screens.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     setError(null);
//     setMessage(null);
//     try {
//       const payload = { ...form };

//       if (!editingId) {
//         // Creating new screen
//         const res = await axios.post(
//           `${BASE_URL}/Create_InventoryScreen`,
//           payload
//         );
//         if (!res.data.success)
//           throw new Error(res.data.message || "Create failed");
//         setMessage("Screen created successfully!");
//       } else {
//         // Updating existing screen
//         const res = await axios.put(
//           `${BASE_URL}/Update_InventoryScreen/${editingId}`,
//           payload
//         );
//         if (!res.data.success)
//           throw new Error(res.data.message || "Update failed");
//         setMessage("Screen updated successfully!");
//       }

//       fetchScreens();
//       setForm(initialFormState);
//       setEditingId(null);
//     } catch (err) {
//       setError(err.message || "Error submitting data.");
//     }
//   };

//   const handleEdit = (item) => {
//     const { Inventory_Screens_ID, ...rest } = item;
//     setForm(rest);
//     setEditingId(Inventory_Screens_ID);
//     setError(null);
//     setMessage(null);
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setForm(initialFormState);
//     setError(null);
//     setMessage(null);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this screen?")) return;

//     setError(null);
//     setMessage(null);
//     try {
//       const res = await axios.delete(
//         `${BASE_URL}/Delete_InventoryScreen/${id}`
//       );
//       if (!res.data.success)
//         throw new Error(res.data.message || "Delete failed");
//       setMessage("Screen deleted successfully!");
//       fetchScreens();
//     } catch (err) {
//       setError(err.message || "Error deleting screen.");
//     }
//   };

//   return (
//     <Paper sx={{ p: 3, maxWidth: 1200, margin: "2rem auto" }}>
//       <Typography variant="h5" gutterBottom>
//         {editingId ? "Update Screen" : "Add New Screen"}
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       {message && (
//         <Alert severity="success" sx={{ mb: 2 }}>
//           {message}
//         </Alert>
//       )}

//       <Stack
//         direction="row"
//         spacing={3}
//         flexWrap="wrap"
//         rowGap={3}
//         columnGap={3}
//         sx={{ mb: 4 }}
//       >
//         <TextField
//           label="Brand"
//           name="Brand"
//           value={form.Brand}
//           onChange={handleChange}
//           sx={{ flex: "1 1 220px", minWidth: 200 }}
//           size="small"
//         />
//         <TextField
//           label="Model"
//           name="Model"
//           value={form.Model}
//           onChange={handleChange}
//           sx={{ flex: "1 1 220px", minWidth: 200 }}
//           size="small"
//         />
//         <TextField
//           label="Screen Size"
//           name="Screen_Size"
//           value={form.Screen_Size}
//           onChange={handleChange}
//           sx={{ flex: "1 1 220px", minWidth: 200 }}
//           size="small"
//         />
//         <TextField
//           label="Ports"
//           name="Ports_"
//           value={form.Ports_}
//           onChange={handleChange}
//           sx={{ flex: "1 1 220px", minWidth: 200 }}
//           size="small"
//         />
//       </Stack>

//       <Stack direction="row" spacing={2} justifyContent="flex-end" mb={4}>
//         {editingId && (
//           <Button variant="outlined" color="error" onClick={handleCancelEdit}>
//             Cancel Edit
//           </Button>
//         )}
//         <Button variant="contained" onClick={handleSubmit}>
//           {editingId ? "Update Screen" : "Create Screen"}
//         </Button>
//       </Stack>

//       <Typography variant="h6" gutterBottom>
//         Screens Inventory List
//       </Typography>

//       {loading ? (
//         <Stack alignItems="center" my={3}>
//           <CircularProgress />
//         </Stack>
//       ) : screens.length === 0 ? (
//         <Typography>No screens found.</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table size="small" aria-label="screen inventory table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Facility</TableCell>
//                 <TableCell>Location</TableCell>
//                 <TableCell>Brand</TableCell>
//                 <TableCell>Model</TableCell>
//                 <TableCell>Screen Size</TableCell>
//                 <TableCell>Ports</TableCell>
//                 <TableCell>Stand</TableCell>
//                 <TableCell>QTY Received</TableCell>
//                 <TableCell>QTY on Hand</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {screens.map((item) => (
//                 <TableRow key={item.Inventory_Screens_ID}>
//                   <TableCell>{item.Facility}</TableCell>
//                   <TableCell>{item.Location}</TableCell>
//                   <TableCell>{item.Brand}</TableCell>
//                   <TableCell>{item.Model}</TableCell>
//                   <TableCell>{item.Screen_Size}</TableCell>
//                   <TableCell>{item.Ports_}</TableCell>
//                   <TableCell>{item.Stand}</TableCell>
//                   <TableCell>{item.QTY_Received}</TableCell>
//                   <TableCell>{item.QTY_on_Hand}</TableCell>
//                   <TableCell align="center">
//                     {/* Action buttons here */}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Paper>
//   );
// };

// export default InventoryScreens;

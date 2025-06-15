import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Stack,
  Link,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = "http://10.2.0.2:8000/api";

const RegisterUser = ({ updateMode = false, userData = {} }) => {
  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(userData.role || "technician");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Optional: Update form values if props change
  useEffect(() => {
    if (updateMode) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setRole(userData.role || "technician");
    }
  }, [userData, updateMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name,
      email,
      role,
    };

    if (!updateMode) payload.password = password;
    if (updateMode) payload.id = userData.id;

    try {
      if (updateMode) {
        await axios.put(`${BASE_URL}/updateUser`, payload);
        Swal.fire("Updated!", "User details updated.", "success");
      } else {
        await axios.post(`${BASE_URL}/createUser`, payload);
        Swal.fire("Account Created", "User registered successfully.", "success");
      }

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {updateMode ? "Update User" : "Register Yourself"}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              disabled={updateMode} // prevent email change during update
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!updateMode && (
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            <FormControl fullWidth required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="inventory">Inventory</MenuItem>
                <MenuItem value="product_finish">Product Finish</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" size="large" fullWidth>
              {updateMode ? "Update User" : "Register"}
            </Button>
          </Stack>
        </Box>

        {!updateMode && (
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Login
            </Link>
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default RegisterUser;

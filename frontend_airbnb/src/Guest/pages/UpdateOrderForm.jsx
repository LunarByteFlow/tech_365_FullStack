import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Styling for the input fields
const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& input": { fontSize: "1.4rem" },
  "& input::placeholder": { fontSize: "1.5rem" },
  "& .MuiOutlinedInput-notchedOutline": { borderWidth: "2px" },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: theme.spacing(1),
  textAlign: "center",
}));

const useStyles = makeStyles(() => ({
  title: {
    marginTop: "6rem",
    marginBottom: "2rem",
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
  },
}));

const UpdateOrderForm = () => {
  const [formData, setFormData] = useState({
    Order_No: "",
    PKD_By: "",
    Built_By: "",
    INS_By: "",
    Type: "",
    QTY: "",
    Model: "",
    Brand: "",
    SERIAL_No: "",
    Description: "",
    Hard_Drive: "",
    Ram: "",
    OS: "",
    Cable: "",
    KB_Mice: "",
    Prime: "",
    Dispatched: "",
    Labels: "",
    Post_Code: "",
    Disp_Date: "",
    MU: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const classes = useStyles();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "QTY" || name === "Ram") && value && isNaN(value)) {
      return; // Prevent non-numeric input
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { Description, Order_No, QTY, Ram } = formData;

    // Validate Description
    const wordCount = Description.split(/\s+/).filter(Boolean).length;
    if (wordCount < 10 || wordCount > 150) {
      newErrors.Description = "Description must be between 10 and 150 words.";
    }

    // Validate Order_No
    if (!Order_No.trim()) {
      newErrors.Order_No = "Order number is required.";
    }

    // Validate QTY (should be a number)
    if (QTY && isNaN(QTY)) {
      newErrors.QTY = "Quantity should be a number.";
    }

    // Validate Ram (should be a number)
    if (Ram && isNaN(Ram)) {
      newErrors.Ram = "RAM should be a number.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Prevent form submission if there are errors
    }

    try {
      await axios.put(`${API_BASE_URL}/api/update-order`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Order Updated!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/"); // Navigate after success
    } catch (err) {
      console.error("Error updating order:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <>
      <Typography className={classes.title}>Update Order Details</Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          width: "80%",
          margin: "auto",
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2}>
          {Object.entries(formData).map(([key, value]) => {
            const isNumericField = ["QTY", "Ram"].includes(key);
            return (
              <Item key={key}>
                <StyledTextField
                  fullWidth
                  label={key}
                  variant="outlined"
                  type={isNumericField ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  error={!!errors[key]}
                  helperText={errors[key] || ""}
                />
              </Item>
            );
          })}
        </Stack>
        <Box mt={3} textAlign="center">
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update Order
          </button>
        </Box>
      </Box>
    </>
  );
};

export default UpdateOrderForm;

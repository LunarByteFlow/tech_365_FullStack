import React, { useState, useEffect } from "react";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

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

const AddNewOrder = () => {
  const [formData, setFormData] = useState({
    PKD_By: "",
    Built_By: "",
    INS_By: "",
    Type: "",
    Order_No: "",
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
    Processor: "",
  });

  const [errors, setErrors] = useState({});
  const [inventoryOptions, setInventoryOptions] = useState({
    types: [],
    models: [],
    hardDrives: [],
    processors: [],
    rams: [],
    brands: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const fetchInventoryOptions = async () => {
      try {
        const response = await axios.get(
          "https://c1cb-86-22-227-192.ngrok-free.app/api/Get_Inventory_Order"
        );
        const data = response.data.data;

        const unique = (key) => [
          ...new Set(data.map((item) => item[key]).filter(Boolean)),
        ];

        setInventoryOptions({
          types: unique("Type"),
          models: unique("Model"),
          hardDrives: unique("Hard_Drive"),
          processors: unique("Processor"),
          rams: unique("RAM"),
          brands: unique("Brand"),
        });
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setErrorMessage("Failed to fetch inventory data.");
      }
    };

    fetchInventoryOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "QTY" || name === "Ram") && value && isNaN(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "PKD_By",
      "Built_By",
      "INS_By",
      "Order_No",
      "QTY",
      "Model",
      "Brand",
      "SERIAL_No",
      "Post_Code",
      "Disp_Date",
      "MU",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    const { Description, QTY, Ram, Disp_Date } = formData;

    const wordCount = Description.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10 || wordCount > 50) {
      newErrors.Description = "Description must be between 10 and 50 words.";
    }

    if (QTY && isNaN(QTY)) {
      newErrors.QTY = "Quantity should be a number.";
    }

    if (Ram && isNaN(Ram)) {
      newErrors.Ram = "RAM should be a number.";
    }

    if (
      Disp_Date &&
      !/^\d{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i.test(
        Disp_Date
      )
    ) {
      newErrors.Disp_Date =
        "Date must be in DD-MMM format (e.g., 11-Feb or 03-aug).";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:8000/api/AddOrder",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Order Added!",
        text: response.data.message || "Success!",
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({
        PKD_By: "",
        Built_By: "",
        INS_By: "",
        Type: "",
        Order_No: "",
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
        Processor: "",
      });

      navigate("/admin");
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Something went wrong.";
      setErrorMessage(backendMessage);

      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: backendMessage,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dropdownFields = {
    Type: inventoryOptions.types,
    Model: inventoryOptions.models,
    Hard_Drive: inventoryOptions.hardDrives,
    Processor: inventoryOptions.processors,
    Ram: inventoryOptions.rams,
    Brand: inventoryOptions.brands,
  };

  return (
    <>
      <Typography className={classes.title}>Add Order Details Here</Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onClick={handleSubmit}
        sx={{
          width: "80%",
          margin: "auto",
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          {Object.entries(formData).map(([key, value]) => {
            const isNumericField = ["QTY", "Ram"].includes(key);
            const label = key.replace(/_/g, " ");

            if (dropdownFields[key]) {
              return (
                <Item key={key}>
                  <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                      name={key}
                      value={value}
                      onChange={handleChange}
                      error={!!errors[key]}
                    >
                      {dropdownFields[key].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors[key] && (
                    <Typography color="error">{errors[key]}</Typography>
                  )}
                </Item>
              );
            }

            return (
              <Item key={key}>
                <StyledTextField
                  fullWidth
                  label={label}
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

        {errorMessage && (
          <Box mt={2} textAlign="center">
            <Typography style={{ color: "red", fontWeight: 500 }}>
              {errorMessage}
            </Typography>
          </Box>
        )}

        <Box mt={3} textAlign="center">
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: isSubmitting ? "#ccc" : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </button>
        </Box>
      </Box>
    </>
  );
};

export default AddNewOrder;

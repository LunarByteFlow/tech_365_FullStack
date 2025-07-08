import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Stack
} from "@mui/material";

const InventoryUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);

  const BASE_URL = "http://10.2.0.2:8000/api";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a CSV file.");
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setStatus("Uploading...");
      setSuccess(null);

      const response = await axios.post(`${BASE_URL}/UploadInventoryCSV`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setStatus("CSV uploaded and processed successfully.");
        setSuccess(true);
        setFile(null);
      } else {
        setStatus("Upload failed: " + (response.data.message || "Unknown error."));
        setSuccess(false);
      }
    } catch (error) {
      setStatus("Error uploading file.");
      setSuccess(false);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "40px auto", p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Upload Inventory CSV
        </Typography>

        <Stack spacing={2}>
          <Button variant="contained" component="label">
            {file ? "Change File" : "Choose CSV File"}
            <input type="file" accept=".csv" hidden onChange={handleFileChange} />
          </Button>

          {file && (
            <Typography variant="body2" color="textSecondary">
              Selected File: {file.name}
            </Typography>
          )}

          <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading}>
            Upload
          </Button>

          {uploading && <LinearProgress />}

          {status && (
            <Alert severity={success ? "success" : "error"}>
              {status}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InventoryUploader;

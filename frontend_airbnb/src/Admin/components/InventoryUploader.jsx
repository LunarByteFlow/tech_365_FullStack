import React, { useState } from "react";
import axios from "axios";

const InventoryUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
// BASE_URL= "http://localhost:8000/api";
const BASE_URL= "http://10.2.0.2:8000/api";
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      const response = await axios.post(`${BASE_URL}/UploadInventoryCSV`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setStatus("CSV uploaded and processed successfully.");
      } else {
        setStatus("Upload failed: " + (response.data.message || "Unknown error."));
      }
    } catch (error) {
      setStatus("Error uploading file.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Upload Inventory CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>Upload</button>
      <p>{status}</p>
    </div>
  );
};

export default InventoryUploader;

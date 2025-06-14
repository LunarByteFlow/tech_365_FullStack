import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const FiveFields = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/Get5ProductFinishesFields")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReturns(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching Laptop prebuilts:", err);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Returns
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Render table headers from keys */}
              {returns[0] &&
                Object.keys(returns[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, i) => (
                  <TableCell key={i}>{value ?? "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FiveFields;

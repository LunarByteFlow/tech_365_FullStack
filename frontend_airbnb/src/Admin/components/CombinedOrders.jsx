import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { saveAs } from "file-saver";

const CombinedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://10.2.0.2:8000/api";

  useEffect(() => {
    fetch(`${BASE_URL}/Get5ProductFinishesFields`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const downloadCSV = () => {
    if (!orders.length) return;

    const headers = Object.keys(orders[0]);
    const csv = [
      headers.join(","),
      ...orders.map((order) =>
        headers.map((h) => `"${order[h] ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "CombinedOrders.csv");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            📋 Combined Orders View
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={downloadCSV}
            disabled={!orders.length}
          >
            ⬇️ Download CSV
          </Button>
        </Stack>

        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Finished By</TableCell>
                <TableCell>Finish Date</TableCell>
                <TableCell>QTY</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Serial Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.FinishedBy}</TableCell>
                  <TableCell>
                    {row.FinishDate
                      ? new Date(row.FinishDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{row.QTY}</TableCell>
                  <TableCell>{row.Area}</TableCell>
                  <TableCell>{row.SerialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default CombinedOrders;

import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Fade,
} from "@mui/material";

function DownloadCSV() {
  const [groupedOrders, setGroupedOrders] = useState({});

  const monthMap = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/Get_Orders")
      .then((res) => res.json())
      .then((result) => {
        const orders = result.data;
        const groups = {};

        orders.forEach((order) => {
          const dateStr = order.DispatchDate;
          const monthAbbr = dateStr?.split("-")[1]?.toLowerCase();
          if (!monthAbbr) return;

          const capitalizedMonth =
            monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1);

          if (!groups[capitalizedMonth]) groups[capitalizedMonth] = [];
          groups[capitalizedMonth].push(order);
        });

        setGroupedOrders(groups);
      });
  }, []);

  const downloadCSV = (orders, month) => {
    if (!orders || orders.length === 0) return;

    const headers = Object.keys(orders[0]);
    const csv = [
      headers.join(","),
      ...orders.map((order) =>
        headers.map((h) => `"${order[h] ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${month}_orders.csv`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Fade in timeout={600}>
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            📥 Download Monthly Orders
          </Typography>

          <Stack spacing={2} mt={3} alignItems="center">
            {Object.entries(groupedOrders).map(([abbr, orders]) => (
              <Button
                key={abbr}
                variant="contained"
                color="primary"
                onClick={() => downloadCSV(orders, abbr)}
                sx={{
                  width: "100%",
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  boxShadow: 2,
                  ":hover": {
                    backgroundColor: "#1565c0",
                    transform: "scale(1.03)",
                    boxShadow: 4,
                  },
                }}
              >
                📁 Download {monthMap[abbr] ?? abbr} Orders
              </Button>
            ))}
          </Stack>
        </Paper>
      </Fade>
    </Container>
  );
}

export default DownloadCSV;

import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper
} from '@mui/material';

function DownloadCSV() {
  const [groupedOrders, setGroupedOrders] = useState({});

  // Map short month names to full month names
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
    Dec: "December"
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/Get_Orders')
      .then(res => res.json())
      .then(result => {
        const orders = result.data;
        const groups = {};

        orders.forEach(order => {
          const dateStr = order.Disp_Date; // e.g., "03-Feb"
          const monthAbbr = dateStr?.split('-')[1]?.toLowerCase();
          if (!monthAbbr) return;

          const capitalizedMonth = monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1); // e.g., 'feb' -> 'Feb'

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
      headers.join(','),
      ...orders.map(order =>
        headers.map(h => `"${order[h] ?? ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${month}_orders.csv`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" mt="5" gutterBottom>
          Download Monthly Orders
        </Typography>

        <Stack spacing={2} alignItems="center">
          {Object.entries(groupedOrders).map(([abbr, orders]) => (
            <Button
              key={abbr}
              variant="contained"
              color="primary"
              onClick={() => downloadCSV(orders, abbr)}
              sx={{ width: '100%' }}
            >
              Download {monthMap[abbr] ?? abbr} Orders
            </Button>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}

export default DownloadCSV;

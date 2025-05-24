import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import AdminNavbar from "./AdminNavbar";
import LowStockTable from "./LowStockTable";
import DownloadCSV from "./DownloadCSV";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";

const AdminHome = () => {
  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 10,mb:20 }}>
        <Box textAlign="center" mb={5}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to the Admin Panel
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your dashboard, users, and data here.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Dashboard Overview */}
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Dashboard Overview
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <DownloadCSV />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Export key data from your dashboard in CSV format.
              </Typography>
            </Paper>
          </Grid>

          {/* User Management */}
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleAltIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  User Management
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <LowStockTable />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminHome;

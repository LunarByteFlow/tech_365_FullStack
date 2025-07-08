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
import DisplayOrders from "../../Guest/pages/DisplayOrders";
import OrderReturns from "./OrderReturns.jsx";
import InventoryParts from "./InventoryParts.jsx";
import InventoryLaptop from "./InventoryLaptop.jsx";
import InventoryDesktops from "./InventoryDesktops.jsx";
import InventoryScreens from "./InventoryScreens.jsx";
import PrebuiltDesktops from "./PrebuiltDesktops.jsx";
import PrebuiltLaptops from "./PrebuiltLaptops.jsx";
import InventoryUploader from "./InventoryUploader.jsx";

const AdminHome = () => {
  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 10, mb: 20 }}>
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

          <Grid item xs={12}>
            <InventoryUploader />
          </Grid>

          <Grid item xs={12}>
            <DisplayOrders />
          </Grid>

          {/* Order Returns */}
          <Grid item xs={12}>
            <OrderReturns />
          </Grid>

          {/* Inventory Parts */}
          <Grid item xs={12}>
            <InventoryParts />
          </Grid>

          {/* Inventory Laptops */}
          <Grid item xs={12}>
            <InventoryLaptop />
          </Grid>

          {/* Inventory Desktops */}
          <Grid item xs={12}>
            <InventoryDesktops />
          </Grid>

          {/* Inventory Screens */}
          <Grid item xs={12}>
            <InventoryScreens />
          </Grid>

          <Grid item xs={12}>
            <PrebuiltDesktops />
          </Grid>

          <Grid item xs={12}>
            <PrebuiltLaptops />
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
          {/* Display Orders */}
          {/* Each of these components needs to be wrapped in a Grid item */}
        </Grid>
      </Container>
    </>
  );
};

export default AdminHome;

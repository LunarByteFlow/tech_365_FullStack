import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import UserNavbar from "./ProductFinishNavbar";
const ProductFinishHome = () => {
  return (
    <>
      <UserNavbar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 4 }}>
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Welcome to the User Panel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You are currently viewing the Product Finish.
            </Typography>
            <Box mt={4}>
              {[...Array(5)].map((_, i) => (
                <Typography variant="h6" key={i} gutterBottom>
                  This is the Home page of the Product Finish. Panel
                </Typography>
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ProductFinishHome;

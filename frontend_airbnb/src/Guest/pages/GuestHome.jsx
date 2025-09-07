import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
} from "@mui/material";
// import GuestNavbar from "../../Admin/components/GuestNavbar";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const GuestHome = () => {
  return (
    <>
      
      <Box
        sx={{
          background: "linear-gradient(to right, #dfefff, #f6f9fc)",
          minHeight: "100vh",
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Paper
              elevation={6}
              sx={{
                borderRadius: 5,
                p: 5,
                background: "#ffffff",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Welcome to the Guest Panel
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select your role to continue
              </Typography>
            </Paper>
          </motion.div>

          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} sm={6}>
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    textAlign: "center",
                    backgroundColor: "#f0f4ff",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Admin Panel
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Manage orders, update the database, and monitor system data.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => (window.location.href = "/login")}
                  >
                    Go to Admin
                  </Button>
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    textAlign: "center",
                    backgroundColor: "#e6fff8",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    User Panel
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Access user tools, view updates, and interact with data.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => (window.location.href = "/login")}
                  >
                    Go to User
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default GuestHome;

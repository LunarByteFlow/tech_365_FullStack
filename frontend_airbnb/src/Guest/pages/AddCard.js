import React from "react";

import {
  Card,
  CardMedia,
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paragraphs_title: {
    fontSize: "1.9rem",
    fontWeight: "bold",
  },
}));
const AddCard = ({ place }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = useStyles();
  return (
    <Card
      sx={{
        marginTop: "30px",
        maxWidth: "100%",
        maxHeight: "100vh",
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Initial box-shadow
        transition: "box-shadow 0.3s ease-in-out", // Add transition to the box-shadow property
        "&:hover": {
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Change box-shadow on hover for a 3D effect
        },
      }}
    >
      <CardMedia
        component="img"
        image={`http://localhost:8000/uploads/${place.photos[0]}`}
        alt="Rental property"
        sx={{ height: 300 }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "40%",
          backgroundColor: "transparent",
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",

          "&:hover": {
            opacity: 0.7,
            background: `linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`,
          },
        }}
      />

      
      <CardContent sx={{ position: "relative" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ transition: "color 0.3s ease-in-out" }}
            >
              <span className={classes.paragraphs_title}>Title: </span>{" "}
              {place.title}
            </Typography>
          </Grid>
          <Grid item xs={isMobile ? 12 : 6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ transition: "color 0.3s ease-in-out" }}
            >
              <span className={classes.paragraphs_title}>Address: </span>{" "}
              {place.address}
            </Typography>
          </Grid>
          <Grid item xs={isMobile ? 12 : 6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ transition: "color 0.3s ease-in-out" }}
            >
              <span className={classes.paragraphs_title}>Details: </span>
              {place.description}
            </Typography>
          </Grid>
          <Grid item xs={isMobile ? 12 : 6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ transition: "color 0.3s ease-in-out" }}
            >
              <span className={classes.paragraphs_title}>
                Some extra Information:{" "}
              </span>
              {place.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={Link}
              to={`/getAdbyId/${place._id}`}
              variant="contained"
              sx={{
                fontWeight:"bold",
                fontSize:"1.1rem",
                mt: 1,
                backgroundColor: "orange",
                transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
                "&:hover": { 
                  transform: "translateX(0.5)", 
                  backgroundColor: "secondary.main", // Change background color on hover
                },
              }}
            >
              Learn More
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AddCard;

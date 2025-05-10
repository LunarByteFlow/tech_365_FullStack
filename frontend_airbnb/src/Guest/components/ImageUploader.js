import React from "react";
import { Typography, Grid, IconButton, makeStyles } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles((theme) => ({
  uploadButton: {
    margin: theme.spacing(2, 0),
  },
  imagePreview: {
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
  },
}));

const ImageUploader = ({ photos, handleImageChange }) => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Upload Photos
      </Typography>
      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          className={classes.uploadButton}
        >
          <CloudUploadIcon fontSize="large" />
        </IconButton>
      </label>
      <Grid container spacing={2}>
        {photos.length > 0 &&
          photos.map((photo, index) => (
            <Grid item key={index}>
              <img
                className={classes.imagePreview}
                src={photo.preview}
                alt={`Image ${index}`}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default ImageUploader;

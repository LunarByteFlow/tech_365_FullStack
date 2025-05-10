import React from 'react';
import { makeStyles, Grid, TextField, Button, Typography, IconButton } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: theme.spacing(6, 4),
    fontFamily: 'Roboto, sans-serif',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  inputField: {
    width: '100%',
    maxWidth: 300,
    marginBottom: theme.spacing(2),
  },
  subscribeButton: {
    width: '100%',
    maxWidth: 300,
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const Footer = () => {
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle newsletter subscription
    alert('Thank you for subscribing!');
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" className={classes.title}>
        Subscribe to Our Newsletter
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.inputField}
          variant="outlined"
          label="Enter your email"
          type="email"
          required
        />
        <Button
          className={classes.subscribeButton}
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<MailOutlineIcon />}
        >
          Subscribe
        </Button>
        <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
      </form>
      <div className={classes.socialIcons}>
        <IconButton color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit">
          <LinkedInIcon />
        </IconButton>
      </div>
      <Typography variant="body2" align="center">
        Connect with us on social media for more updates.
      </Typography>
    </footer>
  );
};

export default Footer;

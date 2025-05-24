import React from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: theme.spacing(6),
    textAlign: 'center',
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  subscribeSection: {
    marginBottom: theme.spacing(4),
  },
  subscribeButton: {
    marginTop: theme.spacing(2),
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleDialogSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    console.log('Subscribed email:', email);
    alert('Thank you for subscribing!');
    handleDialogClose();
  };

  return (
    <footer className={classes.footer}>
      <div className={classes.subscribeSection}>
        <Typography variant="h6" className={classes.title}>
          Subscribe to Our Newsletter
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<MailOutlineIcon />}
          onClick={handleDialogOpen}
        >
          Subscribe
        </Button>
      </div>

      <div className={classes.socialIcons}>
        <IconButton color="inherit" aria-label="Facebook">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="Twitter">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="LinkedIn">
          <LinkedInIcon />
        </IconButton>
      </div>

      <Typography variant="body2" style={{ marginTop: '1.5rem' }}>
        Connect with us on social media for updates and more.
      </Typography>

      {/* Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <form onSubmit={handleDialogSubmit}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your email address to receive our latest news and updates.
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              required
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit">Subscribe</Button>
          </DialogActions>
        </form>
      </Dialog>
    </footer>
  );
};

export default Footer;

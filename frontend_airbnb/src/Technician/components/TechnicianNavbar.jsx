import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { logincontext } from "../../GlobalContext/context";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "8px",
    fontSize: "1.7rem",
    color: "white",
  },
  list: {
    width: 250,
  },
  drawerPaper: {
    backgroundColor: "#333",
    color: "#fff",
  },
  drawerLink: {
    textDecoration: "none",
    color: "white",
  },
  appBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "black",
    height: "10vh",
  },
  button: {
    marginLeft: "10px",
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
}));

const TechnicianNavbar = () => {
  const { dispatch } = useContext(logincontext);
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    console.log("Logout clicked"); // Debug line
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3182ce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      Cookies.remove("authToken");
      Cookies.remove("ROLE");
      dispatch({ type: "LOGOUT" });

      Swal.fire("Logged out", "You have been logged out successfully.", "success");
      navigate("/login");
    }
  };

  const navLinks = [
    
    { text: "Add New Product", to: "postAnOrder" },
    { text: "Dispatch", to: "Get_Dispatch" },
    { text: "Orders", to: "Get_Orders" },
    { text: "Inventory Order", to: "Get_Inventory_Order" },
    { text: "Inventory Check", to: "Get_Inventory_Check" },
    { text: "Add Order", to: "AddOrder" },
    { text: "Update orderrrrr", to: "update_order" },
  ];

  const authLinks = [{ text: "Logout", onClick: handleLogout }];

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h5"
            className={classes.title}
            component={Link}
            to="technician"
          >
            tech_365
          </Typography>

          {authLinks.map((link) => (
            <Button
              key={link.text}
              color="inherit"
              onClick={link.onClick}
              className={classes.button}
            >
              {link.text}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navLinks.map((item) => (
              <Link to={item.to} key={item.text} className={classes.drawerLink}>
                <ListItem button>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default TechnicianNavbar;

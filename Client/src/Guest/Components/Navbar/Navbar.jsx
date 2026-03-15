import React, { useState } from "react";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import styles from "./Navbar.module.css";

const Navbar = ({ window }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const handleRegisterClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className={styles.root}>
      <CssBaseline />

      {/* NAVBAR */}
      <AppBar component="nav" className={styles.appBar}>
        <Toolbar>

          {/* Mobile Menu */}
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            className={styles.menuBtn}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography component={Link} to="/" className={styles.logo}>
            HOMEHUNT
          </Typography>

          {/* Desktop Links */}
          <Box className={styles.desktopLinks}>

            <Button
              component={Link}
              to="/guest/login"
              className={styles.navBtn}
            >
              Login
            </Button>

            <Button
              onClick={handleRegisterClick}
              className={styles.navBtn}
            >
              Register
            </Button>

            {/* DROPDOWN */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              classes={{ paper: styles.menuPaper }}
            >

              <MenuItem
                component={Link}
                to="/guest/Registeration"
                onClick={handleCloseMenu}
              >
                User Register
              </MenuItem>

              <MenuItem
                component={Link}
                to="/guest/OwnerReg"
                onClick={handleCloseMenu}
              >
                Owner Register
              </MenuItem>
            </Menu>

          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        container={container}
        open={open}
        onClose={toggleDrawer}
        variant="temporary"
        classes={{ paper: styles.drawerPaper }}
      >
        <Box className={styles.drawerBox} onClick={toggleDrawer}>
          <Typography className={styles.drawerLogo}>
            HOMEHUNT
          </Typography>

          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/guest/login"
                className={styles.drawerItem}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/guest/Registeration"
                className={styles.drawerItem}
              >
                <ListItemText primary="User Register" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/guest/OwnerReg"
                className={styles.drawerItem}
              >
                <ListItemText primary="Owner Register" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;

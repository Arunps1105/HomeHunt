import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { useNavigate } from "react-router-dom";
import styles from './Navbar.module.css'

const Navbar = () => {
  const [anchorElAdmin, setAnchorElAdmin] = React.useState(null)
  const navigate = useNavigate();

  // Example Admin/User data
  const admin = {
    name: 'Admin',
    email: 'arun@gmail.com'
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/Guest/Login");
  };
  const handleProfileClick = () => {
    setAnchorElAdmin(null)
    // Add profile navigation logic here
  }

  return (
    <AppBar position="fixed" className={styles.appbar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className={styles.toolbar}>

          {/* APP NAME */}
          <Typography variant="h6" className={styles.logo}>
            HOME HUNT
          </Typography>

          {/* USER NAME */}
          <Typography className={styles.username}>
            Hi, {admin.name}
          </Typography>

          {/* AVATAR */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={(e) => setAnchorElAdmin(e.currentTarget)}
                sx={{ p: 0.5 }}
              >
                <Avatar className={styles.avatar}>
                  {admin.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElAdmin}
              open={Boolean(anchorElAdmin)}
              onClose={() => setAnchorElAdmin(null)}
              PaperProps={{
                className: styles.menuPaper
              }}
              className={styles.menu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled className={styles.menuItem}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {admin.email}
                  </Typography>
                </Box>
              </MenuItem>

              <Divider className={styles.divider} />

              <MenuItem
                onClick={handleProfileClick}
                className={styles.menuItem}
              >
                👤 My Profile
              </MenuItem>

              <MenuItem
                onClick={handleProfileClick}
                className={styles.menuItem}
              >
                ⚙️ Settings
              </MenuItem>

              <Divider className={styles.divider} />

              <MenuItem
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/Guest/login");
                }}
                className={`${styles.menuItem} ${styles.logout}`}
              >
                🚪 Logout
              </MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
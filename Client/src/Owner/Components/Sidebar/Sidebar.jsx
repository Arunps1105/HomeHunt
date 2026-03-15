import React from 'react'
import { NavLink } from 'react-router-dom'
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import AddHomeIcon from "@mui/icons-material/AddHome";
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import LockResetIcon from "@mui/icons-material/LockReset";
import EditIcon from "@mui/icons-material/Edit";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

import styles from './Sidebar.module.css'

const Sidebar = () => {
  const navItems = [
    { to: "/Owner/Dashboard", icon: <DashboardIcon />, text: "Dashboard" },
    { to: "/Owner/Chats", icon: <NotificationsIcon />, text: "Notifications" },
    { to: "/Owner/MyProfile", icon: <PersonIcon />, text: "My Profile" },
  



    {
      to: "/Owner/Changepassword",
      icon: <LockResetIcon />,
      text: "Change Password",
      badge: null
    },
    {
      to: "/Owner/Editprofile",
      icon: <EditIcon />,
      text: "Edit Profile",
      badge: null
    },
    {
      to: "/Owner/House",
      icon: <AddHomeIcon />,
      text: "Add House",
      badge: null
    },
    {
      to: "/Owner/Gallery",
      icon: <PhotoLibraryIcon />,
      text: "Add Gallery",
      badge: null
    },
    {
      to: "/Owner/Requests",
      icon: <MarkEmailUnreadIcon />,
      text: "Check Requests",
      badge: null
    },
    {
      to: "/Owner/OwnerMyHouses",
      icon: <MapsHomeWorkIcon />,
      text: "My Houses",
      badge: null
    },
     { 
          to: "/Owner/OwnerComplaint", 
          icon: <ReportProblemIcon />, 
           text: "Report Complaint",
         badge: null
    }


  ]

  return (
    <Box className={styles.sidebar}>
      {/* LOGO SECTION */}
      <Box className={styles.logoSection}>
        <HomeIcon className={styles.logoIcon} />
        <Box className={styles.logoText}>
          <span className={styles.logoPrimary}>Home</span>
          <span className={styles.logoAccent}>Hunt</span>
        </Box>
      </Box>

      {/* NAVIGATION */}
      <List className={styles.navList}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <ListItemIcon className={styles.navIcon}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                className: styles.navText
              }}
            />
            <div className={styles.activeIndicator}></div>
          </ListItemButton>
        ))}
      </List>
    </Box>)
}

export default Sidebar
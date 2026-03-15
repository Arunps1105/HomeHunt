import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import LayersIcon from "@mui/icons-material/Layers";
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FeedbackIcon from "@mui/icons-material/Feedback";

import DashboardIcon from '@mui/icons-material/Dashboard'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PlaceIcon from '@mui/icons-material/Place'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import AnalyticsIcon from '@mui/icons-material/Analytics'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  const [openCategories, setOpenCategories] = useState(true)
  const location = useLocation()


  const navItems = [
    {
      to: "/admin",
      icon: <DashboardIcon />,
      text: "Dashboard",
      badge: null
    },
    {
      to: "/admin/district",
      icon: <LocationCityIcon />,
      text: "District",
      badge: 3
    },
    {
      to: "/admin/place",
      icon: <PlaceIcon />,
      text: "Place",
      badge: 5
    },
    {
      to: "/admin/floortype",
      icon: <HomeWorkIcon />,   // you can change icon if you want
      text: "Floor Type",
      badge: null
    },

    {
      to: "/admin/Bhktype",
      icon: <HomeWorkIcon />,
      text: "BHK Type",
      badge: null
    },

    {
      to: "/admin/Tenenttype",
      icon: <PeopleIcon />,
      text: "Tenant Type",
      badge: null
    },
    {
      to: "/admin/ViewComplaint",
      icon: <ReportProblemIcon />,
      text: "View User Complaint",
      badge: null
    },
     {
      to: "/admin/AdminComplaint",
      icon: <ReportProblemIcon />,
      text: "View Owner Complaint",
      badge: null
    },
    {
      to: "/admin/ViewFeedback",
      icon: <FeedbackIcon />,
      text: "View Feedback",
      badge: null
    },
    {
      to: "/admin/AdminUserList",
      icon: <PeopleIcon />,
      text: "View Users",
      badge: null
    },
    {
      to: "/admin/AdminOwnerList",
      icon: <HomeWorkIcon />,
      text: "View Owners",
      badge: null
    }


  ]

  return (
    <Box className={styles.sidebar}>
      <Typography variant="h6" className={styles.logo}>
        Admin Panel
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          mb: 3,
          letterSpacing: '1px'
        }}
      >
        HOME HUNT
      </Typography>

      <List className={styles.list}>
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            text={item.text}
            badge={item.badge}
            active={location.pathname === item.to}
          />
        ))}
      </List>

      {/* Quick Stats Section */}
      <Box sx={{
        mt: 'auto',
        p: 3,
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Today's Stats
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Box>
            <Typography variant="h6" sx={{
              color: '#667eea',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(102,126,234,0.5)'
            }}>
              24
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Listings
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{
              color: '#764ba2',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(118,75,162,0.5)'
            }}>
              8
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Views
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const NavItem = ({ to, icon, text, badge, active }) => (
  <Tooltip title={text} placement="right" arrow>
    <ListItemButton
      component={NavLink}
      to={to}
      className={`${styles.navItem} ${active ? styles.active : ''}`}
    >
      <ListItemIcon className={styles.icon}>
        {badge ? (
          <Badge
            badgeContent={badge}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(135deg, #ff4757, #ff3838)',
                fontSize: '0.6rem',
                height: '18px',
                minWidth: '18px'
              }
            }}
          >
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          sx: { fontWeight: active ? 700 : 500 }
        }}
      />
      {badge && (
        <Typography variant="caption" className={styles.notificationBadge}>
          {badge}
        </Typography>
      )}
    </ListItemButton>
  </Tooltip>
)

export default Sidebar

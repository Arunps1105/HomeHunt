import * as React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Badge from '@mui/material/Badge'

import NotificationsIcon from '@mui/icons-material/Notifications'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import EmailIcon from '@mui/icons-material/Email'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import styles from './Navbar.module.css'

const Navbar = () => {
  const navigate = useNavigate()

  const [anchorElOwner, setAnchorElOwner] = React.useState(null)
  const [anchorElNotify, setAnchorElNotify] = React.useState(null)

  const [Owner, setOwner] = React.useState({
    name: '',
    email: ''
  })

  const [notifications, setNotifications] = React.useState([
    { id: 1, text: 'New property available in your area', time: '5 min ago', unread: true },
    { id: 2, text: 'Viewing schedule confirmed for tomorrow', time: '1 hour ago', unread: true },
    { id: 3, text: 'Property price dropped 10%', time: '2 hours ago', unread: false }
  ])
  /* ================= FETCH OWNER ================= */
  React.useEffect(() => {
    const ownerId = sessionStorage.getItem('owner_id')

    if (!ownerId) return

    axios
      .get(`http://127.0.0.1:8000/api/owner/${ownerId}`)
      .then((res) => {
        setOwner({
          name: res.data.owner_name,
          email: res.data.owner_email
        })
      })
      .catch(() => {
        setOwner({
          name: 'Arun',
          email: 'arun@gmail.com'
        })
      })
  }, [])

  /* ================= FETCH NOTIFICATIONS ================= */
  React.useEffect(() => {
    const ownerId = sessionStorage.getItem('owner_id')
    if (!ownerId) return

    axios
      .get(`http://127.0.0.1:8000/api/owner/notifications/${ownerId}`)
      .then((res) => setNotifications(res.data))
      .catch(() => {
        setNotifications([
          { id: 1, text: 'New property available in your area', time: '5 min ago', unread: true },
          { id: 2, text: 'Viewing schedule confirmed for tomorrow', time: '1 hour ago', unread: true },
          { id: 3, text: 'Property price dropped 10%', time: '2 hours ago', unread: false }
        ])
      })
  }, [])

  /* ================= LOGOUT ================= */
  const logout = () => {
    sessionStorage.clear()
    navigate('/Guest/Login')
  }

  return (
    <AppBar position="fixed" className={styles.navbar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className={styles.toolbar}>

          {/* LOGO */}
          <Box className={styles.logoSection}>
            <Box className={styles.logoContainer}>
              <HomeIcon className={styles.logoIcon} />
              <Box className={styles.logoText}>
                <span className={styles.logoPrimary}>Home</span>
                <span className={styles.logoAccent}>Hunt</span>
              </Box>
            </Box>
          </Box>

          {/* RIGHT */}
          <Box className={styles.rightSection}>

            {/* NOTIFICATIONS */}
            <Tooltip title="Notifications" arrow>
              <IconButton
                className={`${styles.notifyBtn} ${anchorElNotify ? styles.active : ''}`}
                onClick={(e) => setAnchorElNotify(e.currentTarget)}
              >
                <Badge
                  badgeContent={notifications.filter(n => n.unread).length}
                  color="error"
                  className={styles.badge}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElNotify}
              open={Boolean(anchorElNotify)}
              onClose={() => setAnchorElNotify(null)}
              classes={{ paper: styles.notifyMenu }}
            >
              <div className={styles.notifyHeader}>
                <h3 className={styles.notifyTitle}>Notifications</h3>
                <span className={styles.notifyCount}>
                  {notifications.filter(n => n.unread).length} New
                </span>
              </div>

              <Divider />

              {notifications.map(item => (
                <MenuItem
                  key={item.id}
                  className={`${styles.notifyItem} ${item.unread ? styles.unread : ''}`}
                >
                  <div className={styles.notifyContent}>
                    <p className={styles.notifyText}>{item.text}</p>
                    <span className={styles.notifyTime}>{item.time}</span>
                  </div>
                </MenuItem>
              ))}
            </Menu>

            {/* PROFILE */}
            <Box className={styles.OwnerProfile}>
              <Box className={styles.OwnerInfo}>
                <p className={styles.welcomeText}>Welcome back,</p>
                <h3 className={styles.OwnerName}>{Owner.name}</h3>
              </Box>

              <Tooltip title="Account Settings" arrow>
                <Box className={styles.avatarSection}>
                  <IconButton
                    onClick={(e) => setAnchorElOwner(e.currentTarget)}
                    className={styles.avatarBtn}
                  >
                    <Avatar className={styles.avatar}>
                      {Owner.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <KeyboardArrowDownIcon
                    className={styles.expandIcon}
                    onClick={(e) => setAnchorElOwner(e.currentTarget)}
                  />
                </Box>
              </Tooltip>
            </Box>

            <Menu
              anchorEl={anchorElOwner}
              open={Boolean(anchorElOwner)}
              onClose={() => setAnchorElOwner(null)}
              classes={{ paper: styles.OwnerMenu }}
            >
              <div className={styles.OwnerMenuHeader}>
                <Avatar className={styles.menuAvatar}>
                  {Owner.name?.charAt(0)}
                </Avatar>
                <div className={styles.menuOwnerInfo}>
                  <h3 className={styles.menuName}>{Owner.name}</h3>
                  <p className={styles.menuEmail}>
                    <EmailIcon className={styles.emailIcon} />
                    {Owner.email}
                  </p>
                </div>
              </div>

              <Divider />

              <MenuItem
                className={styles.menuItem}
                onClick={() => {
                  setAnchorElOwner(null)
                  navigate("/Owner/MyProfile")
                }}
              >
                <PersonIcon className={styles.menuIcon} />
                My Profile
              </MenuItem>

              <MenuItem className={styles.menuItem}>
                <SettingsIcon className={styles.menuIcon} />
                Account Settings
              </MenuItem>

              <Divider />

              <MenuItem className={styles.menuItemLogout} onClick={logout}>
                <LogoutIcon className={styles.menuIcon} />
                Logout
              </MenuItem>
            </Menu>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar

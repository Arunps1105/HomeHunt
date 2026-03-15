import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MUI ================= */
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LayersIcon from "@mui/icons-material/Layers";

/* ================= ICONS ================= */
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HouseIcon from "@mui/icons-material/House";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CampaignIcon from "@mui/icons-material/Campaign";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import StarsIcon from "@mui/icons-material/Stars";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

/* ================= CSS ================= */
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [anchorElFeedback, setAnchorElFeedback] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [displayName, setDisplayName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [anchorElPref, setAnchorElPref] = useState(null);

  /* ================= FETCH USER NAME SAFELY ================= */
  useEffect(() => {
    const storedName =
      sessionStorage.getItem("name") ||
      sessionStorage.getItem("user_name") ||
      sessionStorage.getItem("username");

    if (storedName && storedName.trim().length > 0) {
      setDisplayName(
        storedName.charAt(0).toUpperCase() + storedName.slice(1)
      );
    }
  }, []);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ================= DATA ================= */
  const notifications = [
    { 
      id: 1, 
      text: "New property available in your area", 
      time: "5 min ago", 
      read: false,
      icon: <NewReleasesIcon />,
      color: "#4CAF50"
    },
    { 
      id: 2, 
      text: "Viewing confirmed for tomorrow", 
      time: "1 hour ago", 
      read: false,
      icon: <CampaignIcon />,
      color: "#FF9800"
    },
    { 
      id: 3, 
      text: "Price dropped on saved property", 
      time: "2 hours ago", 
      read: true,
      icon: <StarsIcon />,
      color: "#9C27B0"
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: "/User", icon: <DashboardIcon />, label: "Dashboard", color: "#6366f1" },
    { path: "/User/Viewhouse", icon: <HouseIcon />, label: "Houses", badge: 12, color: "#10b981" },
    { path: "/User/FavouritesPage", icon: <FavoriteIcon />, label: "Favourites", color: "#ef4444" },
  ];

  const userMenuItems = [
    { path: "/User", icon: <DashboardIcon />, label: "Dashboard", color: "#6366f1" },
    { path: "/User/Myprofile", icon: <PersonIcon />, label: "My Profile", color: "#10b981" },
    { path: "/User/Editprofile", icon: <SettingsIcon />, label: "Edit Profile", color: "#f59e0b" },
    { path: "/User/ChangePassword", icon: <LockIcon />, label: "Change Password", color: "#ef4444" },
  ];

  const feedbackOptions = [
    { 
      label: "Give Feedback", 
      icon: <FeedbackIcon />, 
      color: "#6366f1",
      description: "Share your suggestions",
      action: () => navigate("/User/Feedback")
    },
    { 
      label: "Report Complaint", 
      icon: <ReportProblemIcon />, 
      color: "#ef4444",
      description: "Report an issue",
      action: () => navigate("/User/Complaint")
    },
    { 
      label: "Help Center", 
      icon: <HelpOutlineIcon />, 
      color: "#10b981",
      description: "Get support",
      action: () => navigate("/User/Help")
    },
  ];

  /* ================= HANDLERS ================= */
  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleOpenNotifyMenu = (e) => setAnchorElNotify(e.currentTarget);
  const handleOpenFeedbackMenu = (e) => setAnchorElFeedback(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleCloseNotifyMenu = () => setAnchorElNotify(null);
  const handleCloseFeedbackMenu = () => setAnchorElFeedback(null);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const handleOpenPrefMenu = (e) => setAnchorElPref(e.currentTarget);
  const handleClosePrefMenu = () => setAnchorElPref(null);

  const logout = () => {
    sessionStorage.clear();
    navigate("/Guest/Login");
  };

  return (
    <AppBar 
      position="sticky" 
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`} 
      elevation={scrolled ? 8 : 0}
    >
      <Container maxWidth="xl" className={styles.container}>
        <Toolbar className={styles.toolbar} disableGutters>

          {/* ===== LOGO WITH LEFT MARGIN ===== */}
          <Box className={styles.logoWrapper}>
            <Box
              className={styles.logoSection}
              onClick={() => navigate("/User")}
            >
              <div className={styles.logoGlow}></div>
              <HomeIcon className={styles.logoIcon} />
              <span className={styles.logoText}>
                HOME<span className={styles.logoHighlight}>HUNT</span>
              </span>
            </Box>
          </Box>

          {/* ===== DESKTOP NAV WITH PROPER SPACING ===== */}
          <Box className={styles.desktopNav}>
            {navItems.map((item, index) => (
              <Tooltip key={index} title={item.label} TransitionComponent={Zoom}>
                <Box
                  className={`${styles.navItem} ${
                    window.location.pathname === item.path
                      ? styles.activeNavItem
                      : ""
                  }`}
                  onClick={() => navigate(item.path)}
                  style={{ '--item-color': item.color }}
                >
                  <div className={styles.navIconWrapper}>
                    {item.icon}
                    {item.badge && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </div>
                  <span className={styles.navLabel}>{item.label}</span>
                  {window.location.pathname === item.path && (
                    <div className={styles.activeIndicator}></div>
                  )}
                </Box>
              </Tooltip>
            ))}

            {/* ===== PREFERENCES DROPDOWN ===== */}
            <Tooltip title="Preferences" TransitionComponent={Zoom}>
              <Box
                className={styles.navItem}
                onClick={handleOpenPrefMenu}
                style={{ '--item-color': '#06b6d4' }}
              >
                <div className={styles.navIconWrapper}>
                  <TuneIcon />
                </div>
                <span className={styles.navLabel}>Preferences</span>
                <KeyboardArrowDownIcon className={styles.navArrowIcon} />
              </Box>
            </Tooltip>
          </Box>

          {/* ===== SEARCH BAR - PERFECTLY ALIGNED ===== */}
          <Box className={`${styles.searchWrapper} ${searchFocused ? styles.searchFocused : ""}`}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search properties.."
              className={styles.searchInput}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className={styles.searchShortcut}></div>
          </Box>

          {/* ===== RIGHT SECTION ===== */}
          <Box className={styles.rightSection}>

            {/* FEEDBACK & COMPLAINT BUTTONS */}
            <Box className={styles.feedbackSection}>
              <Tooltip title="Feedback & Support">
                <Button
                  className={styles.feedbackButton}
                  onClick={handleOpenFeedbackMenu}
                  startIcon={<FeedbackIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  variant="outlined"
                >
                  Support
                </Button>
              </Tooltip>

              <Menu
                anchorEl={anchorElFeedback}
                open={Boolean(anchorElFeedback)}
                onClose={handleCloseFeedbackMenu}
                TransitionComponent={Fade}
                classes={{ paper: styles.feedbackMenu }}
              >
                <Box className={styles.feedbackMenuHeader}>
                  <h4>How can we help?</h4>
                  <p>Choose an option below</p>
                </Box>
                {feedbackOptions.map((option, index) => (
                  <MenuItem
                    key={index}
                    className={styles.feedbackMenuItem}
                    onClick={() => {
                      option.action();
                      handleCloseFeedbackMenu();
                    }}
                  >
                    <Box className={styles.feedbackIconWrapper} style={{ backgroundColor: option.color + '20' }}>
                      <span style={{ color: option.color }}>{option.icon}</span>
                    </Box>
                    <Box className={styles.feedbackContent}>
                      <span className={styles.feedbackTitle}>{option.label}</span>
                      <span className={styles.feedbackDescription}>{option.description}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* THEME TOGGLE */}
            <Tooltip title="Toggle Theme">
              <IconButton className={styles.themeToggle} onClick={toggleTheme}>
                <div className={styles.themeIconWrapper}>
                  {theme === "dark" ? <WbSunnyIcon /> : <NightsStayIcon />}
                </div>
              </IconButton>
            </Tooltip>

            {/* NOTIFICATIONS */}
            <Tooltip title="Notifications">
              <IconButton
                className={`${styles.notifyBtn} ${unreadCount ? styles.hasNotifications : ""}`}
                onClick={handleOpenNotifyMenu}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  color="error"
                  className={styles.notifyBadge}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElNotify}
              open={Boolean(anchorElNotify)}
              onClose={handleCloseNotifyMenu}
              TransitionComponent={Fade}
              classes={{ paper: styles.notifyMenu }}
            >
              <Box className={styles.notifyMenuHeader}>
                <h4>Notifications</h4>
                <Chip label={`${unreadCount} new`} size="small" />
              </Box>
              {notifications.map(n => (
                <MenuItem key={n.id} className={styles.notifyMenuItem}>
                  <Box className={styles.notifyIconWrapper} style={{ backgroundColor: n.color + '20' }}>
                    <span style={{ color: n.color }}>{n.icon}</span>
                  </Box>
                  <Box className={styles.notifyContent}>
                    <span className={styles.notifyText}>{n.text}</span>
                    <span className={styles.notifyTime}>{n.time}</span>
                  </Box>
                  {!n.read && <span className={styles.notifyDot}></span>}
                </MenuItem>
              ))}
            </Menu>

            {/* ===== PREFERENCES MENU ===== */}
            <Menu
              anchorEl={anchorElPref}
              open={Boolean(anchorElPref)}
              onClose={handleClosePrefMenu}
              TransitionComponent={Fade}
            >
              <MenuItem
                onClick={() => {
                  navigate("/User/UserBhktype");
                  handleClosePrefMenu();
                }}
              >
                <ApartmentIcon sx={{ mr: 1 }} />
                BHK Preference
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/User/UserFloortype");
                  handleClosePrefMenu();
                }}
              >
                <LayersIcon sx={{ mr: 1 }} />
                Floor Preference
              </MenuItem>
             <MenuItem
  onClick={() => {
    navigate("/User/Recommend");
    handleClosePrefMenu();
  }}
>
  <StarsIcon sx={{ mr: 1 }} />
  Recommended Houses
</MenuItem>
            </Menu>

            {/* ===== USER PROFILE ===== */}
            <Box className={styles.userProfile}>
              <Box className={styles.userInfo}>
  <h3 className={styles.userName}>{displayName}</h3>
</Box>
              <Tooltip title="Account Settings">
                <Box className={styles.avatarSection}>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    className={styles.avatarBtn}
                  >
                    <Avatar className={styles.avatar}>
                      {displayName.charAt(0)}
                    </Avatar>
                    <div className={styles.avatarGlow}></div>
                  </IconButton>
                  <KeyboardArrowDownIcon
                    className={`${styles.expandIcon} ${anchorElUser ? styles.expandIconRotated : ""}`}
                  />
                </Box>
              </Tooltip>
            </Box>

            {/* USER MENU */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              TransitionComponent={Fade}
              classes={{ paper: styles.userMenu }}
            >
              <Box className={styles.userMenuHeader}>
                <Avatar className={styles.menuAvatar}>
                  {displayName.charAt(0)}
                </Avatar>
              <Box className={styles.menuUserInfo}>
  <span className={styles.menuUserName}>{displayName}</span>
  {sessionStorage.getItem("email") && (
    <span className={styles.menuUserEmail}>
      {sessionStorage.getItem("email")}
    </span>
  )}
</Box>
              </Box>

              <Divider className={styles.menuDivider} />

              {userMenuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  className={styles.menuItem}
                  onClick={() => {
                    navigate(item.path);
                    handleCloseUserMenu();
                  }}
                >
                  <span className={styles.menuIcon} style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </MenuItem>
              ))}

              <Divider className={styles.menuDivider} />

              <MenuItem className={styles.menuItemLogout} onClick={logout}>
                <span className={styles.menuIcon}><LogoutIcon /></span>
                <span className={styles.menuLabel}>Logout</span>
              </MenuItem>
            </Menu>

            {/* MOBILE MENU TOGGLE */}
            <IconButton
              className={styles.mobileMenuToggle}
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <Box className={styles.mobileMenu}>
          {navItems.map((item, index) => (
            <Box
              key={index}
              className={styles.mobileMenuItem}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <span className={styles.mobileMenuIcon} style={{ color: item.color }}>
                {item.icon}
              </span>
              <span className={styles.mobileMenuLabel}>{item.label}</span>
              {item.badge && (
                <span className={styles.mobileMenuBadge}>{item.badge}</span>
              )}
            </Box>
          ))}
          <Divider />
          {feedbackOptions.map((option, index) => (
            <Box
              key={index}
              className={styles.mobileMenuItem}
              onClick={() => {
                option.action();
                setMobileMenuOpen(false);
              }}
            >
              <span className={styles.mobileMenuIcon} style={{ color: option.color }}>
                {option.icon}
              </span>
              <span className={styles.mobileMenuLabel}>{option.label}</span>
            </Box>
          ))}
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
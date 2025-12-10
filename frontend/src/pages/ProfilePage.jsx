import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Divider,
  CssBaseline,
  Badge,
  Paper,
  useMediaQuery,
  useTheme as useMuiTheme,
  TextField,
  Button,
  Grid,
  Alert,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Warehouse as WarehouseIcon,
  AddBusiness as NewWarehouseIcon,
  BarChart as StatisticsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: {
      main: green[800],
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Shipment Delivered',
    message: 'Order #12345 has been successfully delivered to warehouse A',
    timestamp: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Product SKU-001 in warehouse B is running low on stock',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Warehouse Maintenance',
    message: 'Scheduled maintenance for warehouse C on Nov 15, 2025',
    timestamp: '2 hours ago',
    read: true
  },
  {
    id: 4,
    type: 'warning',
    title: 'Inventory Discrepancy',
    message: 'Count mismatch detected in warehouse D - aisle B',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'success',
    title: 'System Update Complete',
    message: 'Warehouse management system updated to version 2.5.1',
    timestamp: '3 days ago',
    read: true
  }
];

// Notification Menu Component
const NotificationMenu = ({ notifications, open, anchorEl, onClose }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: 'success.main', fontSize: 24 }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 24 }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'info.main', fontSize: 24 }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main', fontSize: 24 }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#e8f5e9';
      case 'warning':
        return '#fff3e0';
      case 'info':
        return '#e3f2fd';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 420,
          maxHeight: 600,
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          <Chip 
            label={unreadCount} 
            size="small" 
            color="error"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 450, overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={onClose}
              sx={{
                p: 2,
                borderBottom: '1px solid #f0f0f0',
                bgcolor: notification.read ? '#fafafa' : getNotificationColor(notification.type),
                '&:hover': {
                  bgcolor: notification.read ? '#f5f5f5' : getNotificationColor(notification.type),
                },
                alignItems: 'flex-start',
                minHeight: 'auto',
                display: 'flex',
                gap: 2
              }}
            >
              <Box sx={{ flexShrink: 0, mt: 0.5 }}>
                {getNotificationIcon(notification.type)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: notification.read ? 500 : 700,
                      color: '#000',
                    }}
                  >
                    {notification.title}
                  </Typography>
                  {!notification.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        flexShrink: 0,
                        ml: 1,
                        mt: 1
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    display: 'block',
                    mb: 0.5,
                    lineHeight: 1.4,
                  }}
                >
                  {notification.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontSize: '0.7rem',
                  }}
                >
                  {notification.timestamp}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#fafafa', textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          View All Notifications
        </Typography>
      </Box>
    </Menu>
  );
};

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedPage, setSelectedPage] = useState('Profile');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications] = useState(sampleNotifications);
  
  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      const profile = response.data;
      setFormData(prev => ({
        ...prev,
        username: profile.username || '',
        email: profile.email || '',
      }));
      setProfilePictureUrl(profile.profilePicture || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuItemClick = (text) => {
    setSelectedPage(text);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      let updatedUsername = formData.username;
      let updatedEmail = formData.email;

      // IMPORTANT: Update username and email FIRST before changing password
      // This is necessary because the backend password change uses getCurrentUser()
      // which looks up by the username from the JWT token
      if (formData.username && formData.email) {
        const response = await userService.updateProfile(formData.username, formData.email);
        updatedUsername = response.data.username;
        updatedEmail = response.data.email;
        
        // Update user in auth context immediately after profile update
        updateUser({
          username: updatedUsername,
          role: user.role
        });
      }

      // Change password if provided (do this AFTER username change)
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setErrorMessage('New passwords do not match!');
          setLoading(false);
          return;
        }

        if (!formData.oldPassword) {
          setErrorMessage('Please enter your current password');
          setLoading(false);
          return;
        }

        await userService.changePassword(formData.oldPassword, formData.newPassword);

        // Clear password fields after successful change
        setFormData(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file');
        return;
      }

      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');

      try {
        const response = await userService.uploadProfilePicture(file);
        setProfilePictureUrl(response.data.profilePictureUrl);
        setSuccessMessage('Profile picture uploaded successfully!');
        await loadProfile(); // Reload profile to get updated picture
      } catch (error) {
        console.error('Profile picture upload error:', error);
        setErrorMessage(error.response?.data?.error || 'Failed to upload profile picture');
      } finally {
        setLoading(false);
      }
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Warehouses', icon: <WarehouseIcon />, path: '/warehouses' },
    { text: 'New warehouse', icon: <NewWarehouseIcon />, path: '/warehouses/new' },
    { text: 'Statistics', icon: <StatisticsIcon />, path: '/statistics' },
  ];

  // Password validation helpers
  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const showPasswordError = formData.newPassword !== '' && formData.confirmPassword !== '' && !passwordsMatch;

  const drawerContent = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', mr: 2, fontWeight: 600 }}>
          {user ? user.username.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
          {user ? user.username : 'Current User'}
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ my: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={selectedPage === item.text}
              onClick={() => handleMenuItemClick(item.text)}
              sx={{
                color: 'secondary.main',
                borderRadius: 2,
                mx: 1.5,
                '& .MuiListItemIcon-root': {
                  color: 'secondary.main',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderLeft: '5px solid #ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                color: 'secondary.main',
                borderRadius: 2,
                mx: 1.5,
                my: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                },
                '& .MuiListItemIcon-root': {
                  color: 'secondary.main',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'secondary.main',
          color: 'text.primary',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              display: { xs: 'block', md: 'none' },
              fontWeight: 600
            }}
          >
            Profile
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton
            size="large"
            aria-label="show new notifications"
            onClick={handleNotificationClick}
            sx={{
              backgroundColor: 'primary.main',
              color: 'secondary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'primary.main',
              borderRight: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'primary.main',
              borderRight: 'none',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> 
        
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          Profile
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 3, 
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                mr: 3
              }}
            >
              {user ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user ? user.username : 'Current User'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <form onSubmit={handleProfileUpdate}>
          <Grid container spacing={3}>
            {/* Personal information - left column */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Personal Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Change password - right column */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Change Password
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="oldPassword"
                    type="password"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={showPasswordError}
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={showPasswordError}
                    helperText={showPasswordError ? 'Passwords do not match' : ''}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Save button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Notification Menu */}
        <NotificationMenu 
          notifications={notifications}
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
        />
        
      </Box>
    </Box>
  );
};

const ProfilePageWithTheme = () => (
  <ThemeProvider theme={theme}>
    <ProfilePage />
  </ThemeProvider>
);

export default ProfilePageWithTheme;
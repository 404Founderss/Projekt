import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Warehouse as WarehouseIcon,
  AddBusiness as NewWarehouseIcon,
  BarChart as StatisticsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

// Sample warehouse utilization data
const warehouseStats = [
  { id: 1, name: 'Central Warehouse', utilization: 75, stock: 7500, capacity: 10000, status: 'good' },
  { id: 2, name: 'North Distribution Center', utilization: 80, stock: 12000, capacity: 15000, status: 'warning' },
  { id: 3, name: 'South Storage Facility', utilization: 40, stock: 3200, capacity: 8000, status: 'good' },
  { id: 4, name: 'East Regional Hub', utilization: 80, stock: 9600, capacity: 12000, status: 'warning' }
];

// Sample critical alerts
const criticalAlerts = [
  { id: 1, product: 'Widget XL', warehouse: 'Central Warehouse', stock: 45, threshold: 100, type: 'critical' },
  { id: 2, product: 'Component Z', warehouse: 'North Distribution Center', stock: 78, threshold: 150, type: 'low' },
  { id: 3, product: 'Tool Set Pro', warehouse: 'South Storage Facility', stock: 92, threshold: 120, type: 'low' }
];

// Sample activity log
const activityLog = [
  { id: 1, action: 'Added 500 units', product: 'Electronics Product', warehouse: 'Central Warehouse', time: '2 hours ago', type: 'add' },
  { id: 2, action: 'Removed 120 units', product: 'Textiles Product', warehouse: 'North Distribution Center', time: '4 hours ago', type: 'remove' },
  { id: 3, action: 'New warehouse created', product: 'East Regional Hub', warehouse: 'East Regional Hub', time: '1 day ago', type: 'create' },
  { id: 4, action: 'Low stock alert', product: 'Tool Set Pro', warehouse: 'South Storage Facility', time: '2 days ago', type: 'alert' }
];

const getStatusColor = (status) => {
  const colors = { critical: 'error', low: 'warning', good: 'success', warning: 'warning' };
  return colors[status] || 'default';
};

const getActivityIcon = (type) => {
  const icons = { add: '➕', remove: '➖', create: '🏢', alert: '⚠️' };
  return icons[type] || '📋';
};

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

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedPage, setSelectedPage] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications] = useState(sampleNotifications);

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

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Warehouses', icon: <WarehouseIcon />, path: '/warehouses' },
    { text: 'New warehouse', icon: <NewWarehouseIcon />, path: '/warehouses/new' },
    { text: 'Statistics', icon: <StatisticsIcon />, path: '/statistics' },
  ];

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
            Dashboard
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
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
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

        {/* Desktop drawer */}
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
          Dashboard
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 3,
            fontSize: '1rem'
          }}
        >
          Welcome, <span style={{ fontWeight: 600, color: '#1b5e20' }}>{user ? user.username : 'Guest'}</span>! Here's your warehouse overview.
        </Typography>

        {/* Dashboard Widgets */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          
          {/* Row 1: Quick Stats Overview */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white' }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Warehouses</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>4</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>All operational</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #0288d1 0%, #0097a7 100%)', color: 'white' }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Stock</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>32.3K</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Units in all warehouses</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)', color: 'white' }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Avg Utilization</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>69%</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Capacity used</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)', color: 'white' }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Critical Alerts</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{criticalAlerts.length}</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Require attention</Typography>
            </Paper>
          </Grid>

          {/* Row 2: Warehouse Utilization Cards */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Warehouse Utilization</Typography>
            </Box>
            <Grid container spacing={2}>
              {warehouseStats.map((wh) => (
                <Grid item xs={12} sm={6} lg={3} key={wh.id}>
                  <Paper sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>{wh.name}</Typography>
                      <Chip label={`${wh.utilization}%`} color={getStatusColor(wh.status)} size="small" sx={{ fontWeight: 600, flexShrink: 0, ml: 1 }} />
                    </Box>
                    <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, height: 6, mb: 2, overflow: 'hidden' }}>
                      <Box sx={{ bgcolor: wh.status === 'warning' ? 'warning.main' : 'success.main', height: '100%', width: `${wh.utilization}%` }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {wh.stock.toLocaleString()} / {wh.capacity.toLocaleString()} units
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Row 3: Critical Alerts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>⚠️ Critical Alerts</Typography>
              {criticalAlerts.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {criticalAlerts.map((alert) => (
                    <Paper key={alert.id} sx={{ p: 1.5, bgcolor: 'grey.50', borderLeft: `4px solid ${alert.type === 'critical' ? '#d32f2f' : '#f57c00'}` }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{alert.product}</Typography>
                          <Typography variant="caption" color="text.secondary">{alert.warehouse}</Typography>
                        </Box>
                        <Chip label={`${alert.stock} units`} color={getStatusColor(alert.type)} size="small" sx={{ fontWeight: 600 }} />
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                        Min threshold: {alert.threshold} units
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No critical alerts</Typography>
              )}
            </Paper>
          </Grid>

          {/* Row 3: Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📋 Recent Activity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activityLog.slice(0, 4).map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', gap: 1.5, p: 1, borderRadius: 1, bgcolor: 'grey.50', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontSize: '1.25rem' }}>{getActivityIcon(activity.type)}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.action}</Typography>
                      <Typography variant="caption" color="text.secondary">{activity.product}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.25 }}>{activity.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

        </Grid>

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

const DashboardPageWithTheme = () => (
  <ThemeProvider theme={theme}>
    <DashboardPage />
  </ThemeProvider>
);

export default DashboardPageWithTheme;
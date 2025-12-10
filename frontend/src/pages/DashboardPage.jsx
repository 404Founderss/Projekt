import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { warehouseService } from '../services/warehouseService';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { notificationService } from '../services/notificationService';
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
  Chip,
  CircularProgress
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
  Menu as MenuIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const getStatusColor = (status) => {
  const colors = { critical: 'error', low: 'warning', good: 'success', warning: 'warning' };
  return colors[status] || 'default';
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

// Notification Menu Component
const NotificationMenu = ({ open, anchorEl, onClose, notifications }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
          <List>
            {notifications.map((n) => (
              <ListItem key={n.id} alignItems="flex-start" sx={{ borderBottom: '1px solid #f0f0f0' }}>
                <ListItemText
                  primary={n.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">{n.message}</Typography>
                      <Typography variant="caption" color="text.secondary">{n.timestamp}</Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
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
  const [loading, setLoading] = useState(true);
  const [warehouseStats, setWarehouseStats] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalWarehouses: 0,
    totalStock: 0,
    averageUtilization: 0,
    alertCount: 0
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch warehouses, products, and low-stock list in parallel so the cards use real DB data
      const [warehousesResponse, productsResponse, lowStockResponse] = await Promise.all([
        warehouseService.getAll(),
        productService.getAll(),
        inventoryService.getLowStock()
      ]);

      const warehouses = warehousesResponse.data || [];
      const products = productsResponse.data || [];
      const lowStock = lowStockResponse.data || [];

      // Map shelves to their warehouse for quick product-to-warehouse lookup
      const shelfToWarehouse = new Map();
      warehouses.forEach((warehouse) => {
        (warehouse.shelves || []).forEach((shelf) => {
          if (shelf && shelf.id) {
            shelfToWarehouse.set(shelf.id, warehouse.id);
          }
        });
      });

      // Pre-aggregate product stock per warehouse from DB values
      const warehouseStockMap = new Map();
      products.forEach((product) => {
        if (!product || !product.shelfId) return;
        const warehouseId = shelfToWarehouse.get(product.shelfId);
        if (!warehouseId) return;
        const currentTotal = warehouseStockMap.get(warehouseId) || 0;
        warehouseStockMap.set(warehouseId, currentTotal + (product.currentStock || 0));
      });

      let totalCapacity = 0;
      let totalCurrentStock = 0;

      const stats = warehouses.map((warehouse) => {
        const shelves = (warehouse.shelves || []).filter((shelf) => shelf.type === 'shelf');

        // Prefer shelf maxCapacity sum; fall back to warehouse.capacity if no shelves were defined
        const shelfCapacity = shelves.reduce((sum, shelf) => sum + (shelf.maxCapacity || 0), 0);
        const warehouseCapacity = shelfCapacity > 0 ? shelfCapacity : (warehouse.capacity || 0);

        const warehouseStock = warehouseStockMap.get(warehouse.id) || 0;

        totalCapacity += warehouseCapacity;
        totalCurrentStock += warehouseStock;

        const utilization = warehouseCapacity > 0
          ? Math.round((warehouseStock / warehouseCapacity) * 100)
          : 0;

        let status = 'good';
        if (utilization >= 90) {
          status = 'critical';
        } else if (utilization >= 70) {
          status = 'warning';
        }

        return {
          id: warehouse.id,
          name: warehouse.name,
          utilization,
          stock: warehouseStock,
          capacity: warehouseCapacity,
          status
        };
      });

      const averageUtilization = totalCapacity > 0
        ? Math.round((totalCurrentStock / totalCapacity) * 100)
        : 0;

      setWarehouseStats(stats);

      // Fetch notifications from backend
      try {
        const notificationsResponse = await notificationService.getUnread();
        const apiNotifications = notificationsResponse.data || [];
        setNotifications(apiNotifications);

        setDashboardStats({
          totalWarehouses: warehouses.length,
          totalStock: totalCurrentStock,
          averageUtilization,
          alertCount: apiNotifications.length
        });
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
        setDashboardStats({
          totalWarehouses: warehouses.length,
          totalStock: totalCurrentStock,
          averageUtilization,
          alertCount: 0
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setWarehouseStats([]);
      setDashboardStats({
        totalWarehouses: 0,
        totalStock: 0,
        averageUtilization: 0,
        alertCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    // Mark all notifications as read in the backend
    notificationService.markAllAsRead()
      .then(() => {
        // Update local state to reflect that all are read
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      })
      .catch(error => console.error('Failed to mark notifications as read:', error));
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Dashboard Widgets */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
              
              {/* Row 1: Quick Stats Overview */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white' }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Warehouses</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{dashboardStats.totalWarehouses}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>All operational</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #0288d1 0%, #0097a7 100%)', color: 'white' }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Stock</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{dashboardStats.totalStock.toLocaleString()}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Units in all warehouses</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)', color: 'white' }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Avg Utilization</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{dashboardStats.averageUtilization}%</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Capacity used</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)', color: 'white' }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Critical Alerts</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{dashboardStats.alertCount}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Require attention</Typography>
                </Paper>
              </Grid>

              {/* Row 2: Warehouse Utilization Cards */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Warehouse Utilization</Typography>
                </Box>
                {warehouseStats.length > 0 ? (
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
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">No warehouses available. Create one to get started!</Typography>
                  </Paper>
                )}
              </Grid>

            </Grid>
          </>
        )}

        {/* Notification Menu */}
        <NotificationMenu 
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
          notifications={notifications}
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
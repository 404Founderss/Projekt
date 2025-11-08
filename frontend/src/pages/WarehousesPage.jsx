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
  Grid,
  Card,
  CardContent,
  LinearProgress,
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
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon
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

// Sample warehouse data
const warehousesData = [
  {
    id: 1,
    name: 'Central Warehouse',
    capacity: 10000,
    currentStock: 7500,
    lastUpdate: '2025-11-08 14:30'
  },
  {
    id: 2,
    name: 'North Distribution Center',
    capacity: 15000,
    currentStock: 12000,
    lastUpdate: '2025-11-08 13:15'
  },
  {
    id: 3,
    name: 'South Storage Facility',
    capacity: 8000,
    currentStock: 3200,
    lastUpdate: '2025-11-08 12:45'
  },
  {
    id: 4,
    name: 'East Regional Hub',
    capacity: 12000,
    currentStock: 9600,
    lastUpdate: '2025-11-08 15:00'
  }
];

const WarehousesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedPage, setSelectedPage] = useState('Warehouses');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  // Calculate summary statistics
  const totalWarehouses = warehousesData.length;
  const totalCapacity = warehousesData.reduce((sum, wh) => sum + wh.capacity, 0);
  const totalStock = warehousesData.reduce((sum, wh) => sum + wh.currentStock, 0);
  const averageUtilization = ((totalStock / totalCapacity) * 100).toFixed(1);

  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return 'error';
    if (utilization >= 60) return 'warning';
    return 'success';
  };

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
    <ThemeProvider theme={theme}>
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
              Warehouses
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton
              size="large"
              aria-label="show new notifications"
              sx={{
                backgroundColor: 'primary.main',
                color: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <Badge badgeContent={4} color="error">
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
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              mb: 3
            }}
          >
            Warehouses
          </Typography>

          {/* Summary Statistics */}
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarehouseIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Warehouses
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalWarehouses}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Capacity
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalCapacity.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Current Stock
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalStock.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                 <StatisticsIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Average Utilization
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {averageUtilization}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Warehouses List */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {warehousesData.map((warehouse) => {
              const utilization = ((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={warehouse.id}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px 0 rgba(0,0,0,0.12)',
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                          {warehouse.name}
                        </Typography>
                        <Chip 
                          label={`${utilization}%`}
                          color={getUtilizationColor(parseFloat(utilization))}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Capacity
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {warehouse.capacity.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Current Stock
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {warehouse.currentStock.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={parseFloat(utilization)} 
                          color={getUtilizationColor(parseFloat(utilization))}
                          sx={{ 
                            height: 8, 
                            borderRadius: 1,
                            backgroundColor: 'rgba(0,0,0,0.08)'
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="caption" color="text.secondary">
                        Last Update: {warehouse.lastUpdate}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default WarehousesPage;
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
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
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon
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

// Sample warehouse data with shelf information
const warehousesData = [
  {
    id: 1,
    name: 'Central Warehouse',
    capacity: 10000,
    currentStock: 7500,
    lastUpdate: '2025-11-08 14:30',
    shelves: [
      { id: 'A1', occupied: true, items: 250 },
      { id: 'A2', occupied: true, items: 180 },
      { id: 'A3', occupied: false, items: 0 },
      { id: 'B1', occupied: true, items: 320 },
      { id: 'B2', occupied: true, items: 290 },
      { id: 'B3', occupied: true, items: 150 },
      { id: 'C1', occupied: true, items: 410 },
      { id: 'C2', occupied: false, items: 0 },
      { id: 'C3', occupied: true, items: 200 },
      { id: 'D1', occupied: true, items: 380 },
      { id: 'D2', occupied: true, items: 270 },
      { id: 'D3', occupied: true, items: 340 }
    ]
  },
  {
    id: 2,
    name: 'North Distribution Center',
    capacity: 15000,
    currentStock: 12000,
    lastUpdate: '2025-11-08 13:15',
    shelves: [
      { id: 'A1', occupied: true, items: 450 },
      { id: 'A2', occupied: true, items: 380 },
      { id: 'A3', occupied: true, items: 420 },
      { id: 'B1', occupied: true, items: 520 },
      { id: 'B2', occupied: true, items: 490 },
      { id: 'B3', occupied: true, items: 350 },
      { id: 'C1', occupied: true, items: 610 },
      { id: 'C2', occupied: true, items: 580 },
      { id: 'C3', occupied: true, items: 400 },
      { id: 'D1', occupied: true, items: 480 },
      { id: 'D2', occupied: true, items: 470 },
      { id: 'D3', occupied: true, items: 440 }
    ]
  },
  {
    id: 3,
    name: 'South Storage Facility',
    capacity: 8000,
    currentStock: 3200,
    lastUpdate: '2025-11-08 12:45',
    shelves: [
      { id: 'A1', occupied: true, items: 180 },
      { id: 'A2', occupied: false, items: 0 },
      { id: 'A3', occupied: false, items: 0 },
      { id: 'B1', occupied: true, items: 220 },
      { id: 'B2', occupied: true, items: 190 },
      { id: 'B3', occupied: false, items: 0 },
      { id: 'C1', occupied: true, items: 310 },
      { id: 'C2', occupied: false, items: 0 },
      { id: 'C3', occupied: false, items: 0 },
      { id: 'D1', occupied: true, items: 280 },
      { id: 'D2', occupied: true, items: 170 },
      { id: 'D3', occupied: false, items: 0 }
    ]
  },
  {
    id: 4,
    name: 'East Regional Hub',
    capacity: 12000,
    currentStock: 9600,
    lastUpdate: '2025-11-08 15:00',
    shelves: [
      { id: 'A1', occupied: true, items: 350 },
      { id: 'A2', occupied: true, items: 380 },
      { id: 'A3', occupied: true, items: 320 },
      { id: 'B1', occupied: true, items: 420 },
      { id: 'B2', occupied: true, items: 390 },
      { id: 'B3', occupied: true, items: 450 },
      { id: 'C1', occupied: true, items: 510 },
      { id: 'C2', occupied: true, items: 480 },
      { id: 'C3', occupied: true, items: 300 },
      { id: 'D1', occupied: true, items: 380 },
      { id: 'D2', occupied: true, items: 470 },
      { id: 'D3', occupied: true, items: 340 }
    ]
  }
];

// Warehouse Visual Modal Component
const WarehouseVisualModal = ({ open, onClose, warehouse }) => {
  if (!warehouse) return null;

  const utilization = ((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1);
  const occupiedShelves = warehouse.shelves.filter(shelf => shelf.occupied).length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {warehouse.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visual Layout & Storage Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {/* Stats Summary */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {warehouse.shelves.length}
              </Typography>
              <Typography variant="caption">Total Shelves</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: green[600], color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {occupiedShelves}
              </Typography>
              <Typography variant="caption">Occupied</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.400', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {warehouse.shelves.length - occupiedShelves}
              </Typography>
              <Typography variant="caption">Empty</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {utilization}%
              </Typography>
              <Typography variant="caption">Utilization</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Warehouse Layout */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: '#f5f5f5',
            border: '2px dashed #ccc',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
            Warehouse Floor Plan
          </Typography>
          
          {/* Entrance */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 2,
            pb: 1,
            borderBottom: '3px solid #666'
          }}>
            <Typography variant="caption" sx={{ 
              bgcolor: 'warning.main', 
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 600
            }}>
              ENTRANCE
            </Typography>
          </Box>

          {/* Shelves Grid */}
          <Grid container spacing={2}>
            {/* Left Aisle */}
            <Grid item xs={5.5}>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                Aisle A-B
              </Typography>
              <Grid container spacing={1}>
                {warehouse.shelves.slice(0, 6).map((shelf) => (
                  <Grid item xs={4} key={shelf.id}>
                    <Paper
                      elevation={shelf.occupied ? 3 : 0}
                      sx={{
                        p: 1.5,
                        textAlign: 'center',
                        bgcolor: shelf.occupied ? green[700] : 'grey.300',
                        color: shelf.occupied ? 'white' : 'grey.600',
                        borderRadius: 1,
                        border: shelf.occupied ? 'none' : '2px dashed grey.400',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {shelf.id}
                      </Typography>
                      {shelf.occupied ? (
                        <>
                          <InventoryIcon sx={{ fontSize: 28, mb: 0.5 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                            {shelf.items} items
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                          Empty
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Center Aisle */}
            <Grid item xs={1} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderLeft: '2px dashed #999',
              borderRight: '2px dashed #999'
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontWeight: 600,
                  color: 'text.secondary'
                }}
              >
                MAIN CORRIDOR
              </Typography>
            </Grid>

            {/* Right Aisle */}
            <Grid item xs={5.5}>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                Aisle C-D
              </Typography>
              <Grid container spacing={1}>
                {warehouse.shelves.slice(6, 12).map((shelf) => (
                  <Grid item xs={4} key={shelf.id}>
                    <Paper
                      elevation={shelf.occupied ? 3 : 0}
                      sx={{
                        p: 1.5,
                        textAlign: 'center',
                        bgcolor: shelf.occupied ? green[700] : 'grey.300',
                        color: shelf.occupied ? 'white' : 'grey.600',
                        borderRadius: 1,
                        border: shelf.occupied ? 'none' : '2px dashed grey.400',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {shelf.id}
                      </Typography>
                      {shelf.occupied ? (
                        <>
                          <InventoryIcon sx={{ fontSize: 28, mb: 0.5 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                            {shelf.items} items
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                          Empty
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Exit */}
          <Box sx={{ 
            textAlign: 'center', 
            mt: 2,
            pt: 1,
            borderTop: '3px solid #666'
          }}>
            <Typography variant="caption" sx={{ 
              bgcolor: 'error.main', 
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 600
            }}>
              EXIT / LOADING DOCK
            </Typography>
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 20, 
                height: 20, 
                bgcolor: green[700], 
                borderRadius: 0.5,
                mr: 1 
              }} />
              <Typography variant="caption">Occupied Shelf</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 20, 
                height: 20, 
                bgcolor: 'grey.300',
                border: '2px dashed',
                borderColor: 'grey.400',
                borderRadius: 0.5,
                mr: 1 
              }} />
              <Typography variant="caption">Empty Shelf</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Additional Info */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Last Updated: {warehouse.lastUpdate}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Capacity: {warehouse.capacity.toLocaleString()} units | 
            Current Stock: {warehouse.currentStock.toLocaleString()} units
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const WarehousesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedPage, setSelectedPage] = useState('Warehouses');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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

  const handleWarehouseClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWarehouse(null);
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
                  <Card 
                    onClick={() => handleWarehouseClick(warehouse)}
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px 0 rgba(0,0,0,0.12)',
                      }
                    }}
                  >
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
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: 'primary.main', 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          Click to view layout →
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
        </Box>
      </Box>

      {/* Warehouse Visual Modal */}
      <WarehouseVisualModal 
        open={modalOpen}
        onClose={handleCloseModal}
        warehouse={selectedWarehouse}
      />
    </ThemeProvider>
  );
};

export default WarehousesPage;
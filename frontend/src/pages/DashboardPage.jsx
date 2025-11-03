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
  useTheme as useMuiTheme
} from '@mui/material';
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

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedPage, setSelectedPage] = useState('Dashboard');
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
        
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 3, 
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' 
        }}>
          <Typography paragraph sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
            Welcome to your warehouse management dashboard, <strong>{user ? user.username : 'User'}</strong>!
          </Typography>
          <Typography paragraph sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
            From here you can get an overview of your inventory, manage warehouses, and view statistics.
          </Typography>
        </Paper>
        
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
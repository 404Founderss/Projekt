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
  TextField,
  Button,
  Grid,
  Alert
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
  Save as SaveIcon
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

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedPage, setSelectedPage] = useState('Profile');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Validate password match if changing password
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Az új jelszavak nem egyeznek!');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Profil sikeresen frissítve!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 500);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate profile picture upload
      setSuccessMessage('Profilkép sikeresen feltöltve!');
      setTimeout(() => setSuccessMessage(''), 3000);
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
            Profile
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
          Profil
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
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(46, 125, 50, 0.04)'
                  }
                }}
              >
                Profilkép módosítása
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 3, 
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Személyes adatok
          </Typography>

          <form onSubmit={handleProfileUpdate}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Felhasználónév"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email cím"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefonszám"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Jelszó módosítása
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Jelenlegi jelszó"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}></Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Új jelszó"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Új jelszó megerősítése"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

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
                  Módosítások mentése
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        
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
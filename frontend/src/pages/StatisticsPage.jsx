import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Typography, IconButton, Avatar, 
  Divider, CssBaseline, Badge, Paper, useMediaQuery, useTheme as useMuiTheme,
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, Menu, MenuItem // Added Menu, MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon, AccountCircle as ProfileIcon,
  Warehouse as WarehouseIcon, AddBusiness as NewWarehouseIcon,
  BarChart as StatisticsIcon, Logout as LogoutIcon,
  Notifications as NotificationsIcon, Menu as MenuIcon,
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon, Warning as WarningIcon,
  CheckCircle as SuccessIcon, Info as InfoIcon // Added SuccessIcon, InfoIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: { main: green[800] },
    secondary: { main: '#ffffff' },
    background: { default: '#f4f6f8' }
  }
});

const drawerWidth = 260;

// --- SAMPLE NOTIFICATIONS DATA (Added) ---
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
  }
];

// --- NOTIFICATION MENU COMPONENT (Added) ---
const NotificationMenu = ({ notifications, open, anchorEl, onClose }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <SuccessIcon sx={{ color: 'success.main', fontSize: 24 }} />;
      case 'warning': return <WarningIcon sx={{ color: 'warning.main', fontSize: 24 }} />;
      case 'info': return <InfoIcon sx={{ color: 'info.main', fontSize: 24 }} />;
      default: return <InfoIcon sx={{ color: 'info.main', fontSize: 24 }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#e8f5e9';
      case 'warning': return '#fff3e0';
      case 'info': return '#e3f2fd';
      default: return '#f5f5f5';
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 420, maxHeight: 600, borderRadius: 2, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)' }
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Chip label={unreadCount} size="small" color="error" sx={{ fontWeight: 700 }} />
        </Box>
      </Box>
      <Box sx={{ maxHeight: 450, overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={onClose}
              sx={{
                p: 2, borderBottom: '1px solid #f0f0f0',
                bgcolor: notification.read ? '#fafafa' : getNotificationColor(notification.type),
                '&:hover': { bgcolor: notification.read ? '#f5f5f5' : getNotificationColor(notification.type) },
                alignItems: 'flex-start', display: 'flex', gap: 2
              }}
            >
              <Box sx={{ flexShrink: 0, mt: 0.5 }}>{getNotificationIcon(notification.type)}</Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: notification.read ? 500 : 700 }}>
                    {notification.title}
                  </Typography>
                  {!notification.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mt: 1 }} />}
                </Box>
                <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>{notification.message}</Typography>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>{notification.timestamp}</Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">No notifications</Typography></Box>
        )}
      </Box>
    </Menu>
  );
};

// Sample Data
const bestSellers = [
  { name: 'Product A', sales: 4200, trend: '+12%' },
  { name: 'Product B', sales: 3800, trend: '+8%' },
  { name: 'Product C', sales: 3400, trend: '+15%' },
  { name: 'Product D', sales: 2900, trend: '+5%' },
  { name: 'Product E', sales: 2600, trend: '+3%' }
];

const lowestStock = [
  { name: 'Widget XL', stock: 45, min: 100, status: 'critical' },
  { name: 'Component Z', stock: 78, min: 150, status: 'low' },
  { name: 'Tool Set Pro', stock: 92, min: 120, status: 'low' },
  { name: 'Material Y', stock: 110, min: 200, status: 'warning' },
  { name: 'Part Alpha', stock: 135, min: 180, status: 'warning' }
];

const highestStock = [
  { name: 'Basic Supply A', stock: 8900, capacity: 10000, percent: 89, warehouse: 'North' },
  { name: 'Material B', stock: 7200, capacity: 8000, percent: 90, warehouse: 'Central' },
  { name: 'Component C', stock: 6800, capacity: 8000, percent: 85, warehouse: 'East' },
  { name: 'Product D', stock: 5400, capacity: 6500, percent: 83, warehouse: 'South' },
  { name: 'Item E', stock: 4900, capacity: 6000, percent: 82, warehouse: 'North' }
];

const salesData = [
  { month: 'Jun', sales: 18500 },
  { month: 'Jul', sales: 22000 },
  { month: 'Aug', sales: 25800 },
  { month: 'Sep', sales: 23400 },
  { month: 'Oct', sales: 28900 },
  { month: 'Nov', sales: 32100 }
];

const warehouseData = [
  { name: 'Central', value: 75 },
  { name: 'North', value: 80 },
  { name: 'South', value: 40 },
  { name: 'East', value: 80 }
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#2196F3' },
  { name: 'Tools', value: 25, color: '#4CAF50' },
  { name: 'Materials', value: 20, color: '#FF9800' },
  { name: 'Components', value: 15, color: '#9C27B0' },
  { name: 'Others', value: 5, color: '#757575' }
];

// Menu Items Configuration
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Warehouses', icon: <WarehouseIcon />, path: '/warehouses' },
  { text: 'New warehouse', icon: <NewWarehouseIcon />, path: '/warehouses/new' },
  { text: 'Statistics', icon: <StatisticsIcon />, path: '/statistics' }
];

// Helper function for stock status colors
const getStatusColor = (status) => {
  const colors = { critical: 'error', low: 'warning', warning: 'info' };
  return colors[status] || 'default';
};

// Metric Card Component
const MetricCard = ({ icon, label, value, subtitle, color = 'primary.main' }) => (
  <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
    <Typography variant="caption" color={subtitle.includes('+') ? 'success.main' : 'text.secondary'} 
                sx={{ fontWeight: 600 }}>
      {subtitle}
    </Typography>
  </Paper>
);

// Chart Container Component
const ChartCard = ({ title, children, height = 300 }) => (
  <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>{title}</Typography>
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </Paper>
);

const StatisticsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [selectedPage, setSelectedPage] = useState('Statistics');
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- NOTIFICATION STATE (Added) ---
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications] = useState(sampleNotifications);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuClick = (text) => {
    setSelectedPage(text);
    if (isMobile) setMobileOpen(false);
  };

  // --- NOTIFICATION HANDLERS (Added) ---
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Sidebar Content
  const drawerContent = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', mr: 2, fontWeight: 600 }}>
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
          {user?.username || 'User'}
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
              onClick={() => handleMenuClick(item.text)}
              sx={{
                color: 'secondary.main',
                borderRadius: 2,
                mx: 1.5,
                '& .MuiListItemIcon-root': { color: 'secondary.main' },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderLeft: '5px solid #ffffff',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

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
              '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
              '& .MuiListItemIcon-root': { color: 'secondary.main' }
            }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar position="fixed" sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'secondary.main',
          color: 'text.primary',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)'
        }}>
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ display: { xs: 'block', md: 'none' }, fontWeight: 600 }}>
              Statistics
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            
            {/* --- NOTIFICATION ICON (Updated) --- */}
            <IconButton 
              size="large" 
              onClick={handleNotificationClick}
              sx={{
                backgroundColor: 'primary.main',
                color: 'secondary.main',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth, backgroundColor: 'primary.main' }
            }}
          >
            {drawerContent}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { width: drawerWidth, backgroundColor: 'primary.main' }
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }
        }}>
          <Toolbar />
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Statistics & Analytics
          </Typography>

          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <MetricCard 
                icon={<TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />}
                label="Total Sales (Quantity)"
                value="17,900"
                subtitle="+12.3% from last month"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MetricCard 
                icon={<InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />}
                label="Active Products"
                value="342"
                subtitle="Across all warehouses"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MetricCard 
                icon={<WarningIcon sx={{ color: 'error.main', mr: 1 }} />}
                label="Low Stock Alerts"
                value="12"
                subtitle="Requires attention"
                color="error.main"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={8}>
              <ChartCard title="Monthly Sales Trend">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke={green[800]} strokeWidth={3} />
                </LineChart>
              </ChartCard>
            </Grid>
            <Grid item xs={12} lg={4}>
              <ChartCard title="Product Categories">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartCard>
            </Grid>
            <Grid item xs={12}>
              <ChartCard title="Warehouse Utilization" height={250}>
                <BarChart data={warehouseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={green[800]} name="Utilization %" />
                </BarChart>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Data Tables */}
          <Grid container spacing={3}>
            {/* Best Sellers */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Top 5 Best Sellers</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity Sold</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bestSellers.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">{p.sales.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Chip label={p.trend} color="success" size="small" sx={{ fontWeight: 600 }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Lowest Stock */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Lowest Stock Products</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Stock</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Min</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowestStock.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">{p.stock}</TableCell>
                          <TableCell align="right">{p.min}</TableCell>
                          <TableCell align="center">
                            <Chip label={p.status.toUpperCase()} color={getStatusColor(p.status)} 
                                  size="small" sx={{ fontWeight: 600 }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Highest Stock */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Highest Stock Products</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Current Stock</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Capacity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Utilization</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Warehouse</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {highestStock.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">{p.stock.toLocaleString()}</TableCell>
                          <TableCell align="right">{p.capacity.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Chip label={`${p.percent}%`} color={p.percent >= 85 ? 'warning' : 'success'} 
                                  size="small" sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell align="center">{p.warehouse}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
      
      {/* --- NOTIFICATION MENU INSTANCE (Added) --- */}
      <NotificationMenu 
        notifications={notifications}
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
      />
    </ThemeProvider>
  );
};

export default StatisticsPage;
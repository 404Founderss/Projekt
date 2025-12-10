import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Typography, IconButton, Avatar, 
  Divider, CssBaseline, Badge, Paper, useMediaQuery, useTheme as useMuiTheme,
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, Menu, MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon, AccountCircle as ProfileIcon,
  Warehouse as WarehouseIcon, AddBusiness as NewWarehouseIcon,
  BarChart as StatisticsIcon, Logout as LogoutIcon,
  Notifications as NotificationsIcon, Menu as MenuIcon,
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon, Warning as WarningIcon,
  CheckCircle as SuccessIcon, Info as InfoIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statisticsService } from '../services/statisticsService';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import { warehouseService } from '../services/warehouseService';
import { notificationService } from '../services/notificationService';

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: { main: green[800] },
    secondary: { main: '#ffffff' },
    background: { default: '#f4f6f8' }
  }
});

const drawerWidth = 260;

// --- NOTIFICATION MENU COMPONENT (Added) ---
const NotificationMenu = ({ notifications, open, anchorEl, onClose }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({
    totalSalesQty: 0,
    activeProducts: 0,
    lowStockAlerts: 0
  });
  const [topSellers, setTopSellers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [highStockProducts, setHighStockProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  // --- NOTIFICATION STATE ---
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError('');

        const now = new Date();
        const startWindow = new Date();
        startWindow.setMonth(startWindow.getMonth() - 11); // Get last 12 months of data
        startWindow.setDate(1);
        startWindow.setHours(0, 0, 0, 0);

        const startIso = startWindow.toISOString();
        const endIso = now.toISOString();

        console.log('Date range for movements:', { startIso, endIso });

        const [
          productsRes,
          lowStockRes,
          topSellingRes,
          topSellingAllRes,
          categoryRes,
          turnoverRes,
          movementsRes,
          warehousesRes
        ] = await Promise.all([
          productService.getAll(),
          inventoryService.getLowStock(),
          statisticsService.getTopSelling(5),
          statisticsService.getTopSelling(1000), // Get all products for total sales calculation
          statisticsService.getCategoryDistribution(),
          statisticsService.getInventoryTurnover(startIso, endIso),
          inventoryService.getMovements(startIso, endIso),
          warehouseService.getAll()
        ]);

        const products = productsRes.data || [];
        const lowStock = lowStockRes.data || [];
        const topSelling = topSellingRes.data || [];
        const topSellingAll = topSellingAllRes.data || [];
        const categories = categoryRes.data || [];
        const turnover = turnoverRes.data || {};
        const movements = movementsRes.data || [];
        const warehouses = warehousesRes.data || [];

        console.log('Stats loaded:', {
          productsCount: products.length,
          topSellingCount: topSelling.length,
          topSellingAllCount: topSellingAll.length,
          movementsCount: movements.length,
          warehousesCount: warehouses.length,
          turnover,
          sampleMovements: movements.slice(0, 3)
        });

        const activeProducts = products.filter(p => p.isActive !== false).length;

        // Fetch notifications from backend
        let lowStockAlerts = 0;
        try {
          const notificationsResponse = await notificationService.getUnread();
          const apiNotifications = notificationsResponse.data || [];
          setNotifications(apiNotifications);
          lowStockAlerts = apiNotifications.length;
        } catch (error) {
          console.error('Failed to load notifications:', error);
          setNotifications([]);
          lowStockAlerts = 0;
        }
        
        // Calculate total sales from all selling products
        let totalSalesQty = 0;
        if (topSellingAll && topSellingAll.length > 0) {
          totalSalesQty = topSellingAll.reduce((sum, item) => sum + (Number(item.totalSold) || 0), 0);
        } else if (turnover.totalGoodsSold) {
          totalSalesQty = Number(turnover.totalGoodsSold);
        }

        // Create a map of shelf IDs to warehouse names
        const shelfToWarehouseMap = new Map();
        (warehouses || []).forEach((warehouse) => {
          (warehouse.shelves || []).forEach((shelf) => {
            if (shelf && shelf.id) {
              shelfToWarehouseMap.set(shelf.id, warehouse.name);
            }
          });
        });

        const sortedHighStock = [...products]
          .sort((a, b) => (b.currentStock || 0) - (a.currentStock || 0))
          .slice(0, 5)
          .map((p) => {
            const capacity = p.maxStockLevel || p.optimalStockLevel || 0;
            const percent = capacity > 0 ? Math.round(((p.currentStock || 0) / capacity) * 100) : 0;
            const warehouseName = p.shelfId ? shelfToWarehouseMap.get(p.shelfId) : null;
            return {
              name: p.name,
              stock: p.currentStock || 0,
              capacity,
              percent,
              warehouse: warehouseName || p.warehouseName || 'N/A'
            };
          });

        const topSellerRows = topSelling.map((item) => ({
          name: item.productName,
          sales: item.totalSold || 0,
          sku: item.sku
        }));

        const categoryRows = categories.map((c, index) => ({
          name: c.categoryName,
          value: Number(c.productCount || 0),
          color: ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#757575'][index % 5]
        }));

        const shelfToWarehouse = new Map();
        warehouses.forEach((warehouse) => {
          (warehouse.shelves || []).forEach((shelf) => {
            if (shelf && shelf.id) {
              shelfToWarehouse.set(shelf.id, warehouse.id);
            }
          });
        });

        const warehouseStockMap = new Map();
        products.forEach((product) => {
          if (!product.shelfId) return;
          const warehouseId = shelfToWarehouse.get(product.shelfId);
          if (!warehouseId) return;
          const currentTotal = warehouseStockMap.get(warehouseId) || 0;
          warehouseStockMap.set(warehouseId, currentTotal + (product.currentStock || 0));
        });

        const warehouseRows = warehouses.map((warehouse) => {
          const shelves = (warehouse.shelves || []).filter((shelf) => shelf.type === 'shelf');
          const shelfCapacity = shelves.reduce((sum, shelf) => sum + (shelf.maxCapacity || 0), 0);
          const warehouseCapacity = shelfCapacity > 0 ? shelfCapacity : (warehouse.capacity || 0);
          const warehouseStock = warehouseStockMap.get(warehouse.id) || 0;
          const utilization = warehouseCapacity > 0
            ? Math.round((warehouseStock / warehouseCapacity) * 100)
            : 0;
          return {
            name: warehouse.name,
            value: utilization
          };
        });

        const movementsOut = movements.filter((m) => m.movementType === 'OUT');
        console.log('Movements OUT:', movementsOut.length, movementsOut.slice(0, 3));
        
        const monthlyMap = new Map();
        movementsOut.forEach((m) => {
          if (!m.timestamp || !m.quantity) return;
          const date = new Date(m.timestamp);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          const currentTotal = monthlyMap.get(key) || 0;
          monthlyMap.set(key, currentTotal + m.quantity);
        });

        console.log('Monthly map entries:', Array.from(monthlyMap.entries()));

        let salesTrend = Array.from(monthlyMap.entries())
          .map(([key, qty]) => {
            const [year, month] = key.split('-').map(Number);
            const monthLabel = new Date(year, month).toLocaleString('default', { month: 'short' });
            return { month: `${monthLabel} ${year}`, sales: qty };
          })
          .sort((a, b) => {
            const aDate = new Date(a.month);
            const bDate = new Date(b.month);
            return aDate - bDate;
          });

        // If no movement-based data, create a fallback with current month data from total sales
        if (salesTrend.length === 0 && totalSalesQty > 0) {
          const currentDate = new Date();
          const monthLabel = currentDate.toLocaleString('default', { month: 'short' });
          salesTrend = [{ month: `${monthLabel} ${currentDate.getFullYear()}`, sales: totalSalesQty }];
        }

        console.log('Sales trend data:', salesTrend);

        // Get the 5 products with lowest stock
        const lowestStockProducts = [...products]
          .sort((a, b) => (a.currentStock ?? 0) - (b.currentStock ?? 0))
          .slice(0, 5);

        setMetrics({ totalSalesQty, activeProducts, lowStockAlerts });
        setTopSellers(topSellerRows);
        setLowStockProducts(lowestStockProducts);
        setHighStockProducts(sortedHighStock);
        setCategoryData(categoryRows);
        setWarehouseData(warehouseRows);
        
        // Delay setting sales data to trigger animation
        setTimeout(() => {
          setSalesData(salesTrend);
          setAnimationKey(prev => prev + 1);
        }, 100);
      } catch (err) {
        console.error('Failed to load statistics:', err);
        setError('Failed to load statistics data.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>

          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <MetricCard 
                icon={<TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />}
                label="Total Sales (Quantity)"
                value={metrics.totalSalesQty.toLocaleString()}
                subtitle="Last 6 months"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MetricCard 
                icon={<InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />}
                label="Active Products"
                value={metrics.activeProducts.toLocaleString()}
                subtitle="Across all warehouses"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MetricCard 
                icon={<WarningIcon sx={{ color: 'error.main', mr: 1 }} />}
                label="Low Stock Alerts"
                value={metrics.lowStockAlerts.toLocaleString()}
                subtitle="Requires attention"
                color="error.main"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={8}>
              <ChartCard title="Monthly Sales Trend">
                <LineChart 
                  key={`chart-${animationKey}`} 
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={green[800]} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={green[800]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '10px'
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: '5px' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    name="Sales"
                    stroke={green[800]} 
                    strokeWidth={3}
                    fill="url(#colorSales)"
                    dot={{ 
                      fill: green[800], 
                      r: 6, 
                      strokeWidth: 2, 
                      stroke: '#fff',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                    activeDot={{ 
                      r: 8, 
                      strokeWidth: 3,
                      stroke: '#fff',
                      fill: green[800]
                    }}
                    isAnimationActive={true}
                    animationDuration={2000}
                    animationBegin={200}
                    animationEasing="ease-in-out"
                  />
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
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topSellers.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">{p.sales.toLocaleString()}</TableCell>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowStockProducts.map((p) => {
                        return (
                          <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell align="right">{(p.currentStock || 0).toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
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
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Warehouse</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {highStockProducts.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">{(p.stock || 0).toLocaleString()}</TableCell>
                          <TableCell align="center">{p.warehouse}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
            </>
          )}
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
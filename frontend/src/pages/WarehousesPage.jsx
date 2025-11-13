import React, { useState, useMemo, useEffect } from 'react';
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
  CircularProgress,
  Button,
  TextField,
  Alert,
  Popover,
  Stack,
  Menu,
  MenuItem
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
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
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

// Sample product data
const generateProducts = (shelfId, count) => {
  const categories = ['Electronics', 'Textiles', 'Food', 'Tools', 'Furniture', 'Books', 'Home & Garden'];
  const products = [];
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    products.push({
      id: `${shelfId}-P${i + 1}`,
      name: `${category} Product ${i + 1}`,
      category,
      sku: `SKU-${shelfId}-${String(i + 1).padStart(4, '0')}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      unit: ['pcs', 'boxes', 'kg', 'L'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.1 ? 'Available' : 'Reserved'
    });
  }
  return products;
};

// Sample warehouse data with shelf information
const warehousesData = [
  {
    id: 1,
    name: 'Central Warehouse',
    capacity: 10000,
    currentStock: 7500,
    lastUpdate: '2025-11-08 14:30',
    shelves: [
      { id: 'A1', occupied: true, items: 250, products: generateProducts('A1', 25) },
      { id: 'A2', occupied: true, items: 180, products: generateProducts('A2', 18) },
      { id: 'A3', occupied: false, items: 0, products: [] },
      { id: 'B1', occupied: true, items: 320, products: generateProducts('B1', 32) },
      { id: 'B2', occupied: true, items: 290, products: generateProducts('B2', 29) },
      { id: 'B3', occupied: true, items: 150, products: generateProducts('B3', 15) },
      { id: 'C1', occupied: true, items: 410, products: generateProducts('C1', 41) },
      { id: 'C2', occupied: false, items: 0, products: [] },
      { id: 'C3', occupied: true, items: 200, products: generateProducts('C3', 20) },
      { id: 'D1', occupied: true, items: 380, products: generateProducts('D1', 38) },
      { id: 'D2', occupied: true, items: 270, products: generateProducts('D2', 27) },
      { id: 'D3', occupied: true, items: 340, products: generateProducts('D3', 34) }
    ]
  },
  {
    id: 2,
    name: 'North Distribution Center',
    capacity: 15000,
    currentStock: 12000,
    lastUpdate: '2025-11-08 13:15',
    shelves: [
      { id: 'A1', occupied: true, items: 450, products: generateProducts('A1', 45) },
      { id: 'A2', occupied: true, items: 380, products: generateProducts('A2', 38) },
      { id: 'A3', occupied: true, items: 420, products: generateProducts('A3', 42) },
      { id: 'B1', occupied: true, items: 520, products: generateProducts('B1', 52) },
      { id: 'B2', occupied: true, items: 490, products: generateProducts('B2', 49) },
      { id: 'B3', occupied: true, items: 350, products: generateProducts('B3', 35) },
      { id: 'C1', occupied: true, items: 610, products: generateProducts('C1', 61) },
      { id: 'C2', occupied: true, items: 580, products: generateProducts('C2', 58) },
      { id: 'C3', occupied: true, items: 400, products: generateProducts('C3', 40) },
      { id: 'D1', occupied: true, items: 480, products: generateProducts('D1', 48) },
      { id: 'D2', occupied: true, items: 470, products: generateProducts('D2', 47) },
      { id: 'D3', occupied: true, items: 440, products: generateProducts('D3', 44) }
    ]
  },
  {
    id: 3,
    name: 'South Storage Facility',
    capacity: 8000,
    currentStock: 3200,
    lastUpdate: '2025-11-08 12:45',
    shelves: [
      { id: 'A1', occupied: true, items: 180, products: generateProducts('A1', 18) },
      { id: 'A2', occupied: false, items: 0, products: [] },
      { id: 'A3', occupied: false, items: 0, products: [] },
      { id: 'B1', occupied: true, items: 220, products: generateProducts('B1', 22) },
      { id: 'B2', occupied: true, items: 190, products: generateProducts('B2', 19) },
      { id: 'B3', occupied: false, items: 0, products: [] },
      { id: 'C1', occupied: true, items: 310, products: generateProducts('C1', 31) },
      { id: 'C2', occupied: false, items: 0, products: [] },
      { id: 'C3', occupied: false, items: 0, products: [] },
      { id: 'D1', occupied: true, items: 280, products: generateProducts('D1', 28) },
      { id: 'D2', occupied: true, items: 170, products: generateProducts('D2', 17) },
      { id: 'D3', occupied: false, items: 0, products: [] }
    ]
  },
  {
    id: 4,
    name: 'East Regional Hub',
    capacity: 12000,
    currentStock: 9600,
    lastUpdate: '2025-11-08 15:00',
    shelves: [
      { id: 'A1', occupied: true, items: 350, products: generateProducts('A1', 35) },
      { id: 'A2', occupied: true, items: 380, products: generateProducts('A2', 38) },
      { id: 'A3', occupied: true, items: 320, products: generateProducts('A3', 32) },
      { id: 'B1', occupied: true, items: 420, products: generateProducts('B1', 42) },
      { id: 'B2', occupied: true, items: 390, products: generateProducts('B2', 39) },
      { id: 'B3', occupied: true, items: 450, products: generateProducts('B3', 45) },
      { id: 'C1', occupied: true, items: 510, products: generateProducts('C1', 51) },
      { id: 'C2', occupied: true, items: 480, products: generateProducts('C2', 48) },
      { id: 'C3', occupied: true, items: 300, products: generateProducts('C3', 30) },
      { id: 'D1', occupied: true, items: 380, products: generateProducts('D1', 38) },
      { id: 'D2', occupied: true, items: 470, products: generateProducts('D2', 47) },
      { id: 'D3', occupied: true, items: 340, products: generateProducts('D3', 34) }
    ]
  }
];

// Shelf Items Popover Component
const ShelfItemsPopover = ({ open, anchorEl, shelf, warehouseName, onClose, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProducts = useMemo(() => {
    if (!shelf) return [];
    return shelf.products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [shelf, searchTerm, filterCategory, filterStatus]);

  const categories = useMemo(() => {
    if (!shelf) return [];
    const uniqueCategories = new Set(shelf.products.map(p => p.category));
    return Array.from(uniqueCategories);
  }, [shelf]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  if (!shelf) return null;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: 600,
          width: 500,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)',
        }
      }}
    >
      <Box sx={{ p: 2.5, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Shelf {shelf.id}
            </Typography>
            <Typography variant="caption">
              {warehouseName}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={onClose}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Chip 
          label={`${shelf.products.length} Products`}
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
        />
      </Box>

      <Divider />

      <Box sx={{ p: 2, maxHeight: 500, overflowY: 'auto' }}>
        {/* Search and Filter Section */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          {/* Search */}
          <TextField
            placeholder="Search product or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />

          {/* Filter Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 1 }}>
            {/* Category Filter */}
            <TextField
              select
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </TextField>

            {/* Status Filter */}
            <TextField
              select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
            </TextField>

            {/* Reset Button */}
            <IconButton
              onClick={handleResetFilters}
              size="small"
              title="Reset filters"
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Results Summary */}
          <Typography variant="caption" color="text.secondary">
            Showing {filteredProducts.length} of {shelf.products.length} products
          </Typography>
        </Stack>

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <Stack spacing={1}>
            {filteredProducts.map((product) => (
              <Paper
                key={product.id}
                onClick={() => {
                    if (onProductSelect) onProductSelect(product);
                  }}
                sx={{
                  p: 1.5,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.sku}
                    </Typography>
                  </Box>
                  <Chip
                    label={product.status}
                    size="small"
                    color={product.status === 'Available' ? 'success' : 'warning'}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                      Quantity
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      {product.quantity} {product.unit}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <InventoryIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              {shelf.products.length === 0 ? 'No products on this shelf' : 'No matching products found'}
            </Typography>
          </Box>
        )}
      </Box>
    </Popover>
  );
};

  // Product Detail Dialog - shows QR, product name, and add/remove controls
  const ProductDetailDialog = ({ open, onClose, product }) => {
    const [qtyInput, setQtyInput] = useState(1);
    const [qrUrl, setQrUrl] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);
    const [adjusting, setAdjusting] = useState(false);
    const [message, setMessage] = useState(null);
    const [productQty, setProductQty] = useState(product ? product.quantity : 0);

    useEffect(() => {
      setProductQty(product ? product.quantity : 0);
      setQtyInput(1);
      setMessage(null);
      setQrUrl(null);
      if (!open) return;

      // Fetch QR code when dialog opens. Use a local objectUrl variable
      // so cleanup doesn't depend on component state (avoids eslint missing-deps).
      let objectUrl = null;
      const fetchQr = async () => {
        if (!product) return;
        setLoadingQr(true);
        try {
          const res = await fetch(`/api/products/${encodeURIComponent(product.id)}/qrcode`);
          if (!res.ok) throw new Error('Failed to fetch QR');

          const contentType = res.headers.get('content-type') || '';
          if (contentType.startsWith('image/')) {
            const blob = await res.blob();
            objectUrl = URL.createObjectURL(blob);
            setQrUrl(objectUrl);
          } else {
            const json = await res.json();
            if (json && json.qrcodeBase64) {
              setQrUrl(`data:image/png;base64,${json.qrcodeBase64}`);
            } else {
              throw new Error('Unsupported QR response');
            }
          }
        } catch (err) {
          setMessage({ type: 'error', text: 'Unable to load QR code.' });
        } finally {
          setLoadingQr(false);
        }
      };

      fetchQr();

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [open, product]);

    const handleAdjust = async (deltaSign) => {
      if (!product) return;
      const qty = Math.max(0, Number(qtyInput) || 0);
      if (qty <= 0) {
        setMessage({ type: 'error', text: 'Please enter a positive number.' });
        return;
      }

      const delta = deltaSign * qty;
      setAdjusting(true);
      setMessage(null);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(product.id)}/adjust`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ delta }),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Adjustment failed');
        }

        // Optionally read returned new quantity
        let newQty = productQty;
        try {
          const json = await res.json();
          if (json && typeof json.newQuantity === 'number') {
            newQty = json.newQuantity;
          } else {
            newQty = Math.max(0, productQty + delta);
          }
        } catch (e) {
          newQty = Math.max(0, productQty + delta);
        }

        setProductQty(newQty);
        setMessage({ type: 'success', text: `Quantity updated (${delta > 0 ? '+' : ''}${delta})` });
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Update failed' });
      } finally {
        setAdjusting(false);
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{product ? product.name : 'Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          {loadingQr ? (
            <Box sx={{ py: 3 }}>
              <CircularProgress />
            </Box>
          ) : qrUrl ? (
            <Box sx={{ textAlign: 'center' }}>
              <img src={qrUrl} alt="QR Code" style={{ maxWidth: '260px', width: '100%', height: 'auto' }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Unique QR for product ID: {product?.id}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 3 }}>
              <Typography color="text.secondary">QR code not available</Typography>
            </Box>
          )}

          <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="Quantity"
              type="number"
              value={qtyInput}
              onChange={(e) => setQtyInput(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => handleAdjust(-1)}
              disabled={adjusting}
            >
              Remove
            </Button>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => handleAdjust(1)}
              disabled={adjusting}
            >
              Add
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary">Current quantity: {productQty}</Typography>

          {message && (
            <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

// Warehouse Visual Modal Component
const WarehouseVisualModal = ({ open, onClose, warehouse }) => {
  const [selectedShelfAnchor, setSelectedShelfAnchor] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const handleShelfClick = (event, shelf) => {
    setSelectedShelfAnchor(event.currentTarget);
    setSelectedShelf(shelf);
  };

  const handleCloseShelfPopover = () => {
    setSelectedShelfAnchor(null);
    setSelectedShelf(null);
  };

  const handleProductSelect = (product) => {
    setSelectedProductForModal(product);
    setProductModalOpen(true);
  };

  if (!warehouse) return null;

  const utilization = ((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1);
  const occupiedShelves = warehouse.shelves.filter(shelf => shelf.occupied).length;

  return (
    <>
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
            
            <Typography variant="caption" sx={{ display: 'block', mb: 2, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
              Click on any shelf to view its products
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
                        onClick={(e) => handleShelfClick(e, shelf)}
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
                          cursor: shelf.occupied ? 'pointer' : 'default',
                          '&:hover': shelf.occupied ? {
                            transform: 'scale(1.08)',
                            boxShadow: 4,
                            bgcolor: green[600],
                          } : {
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
                        onClick={(e) => handleShelfClick(e, shelf)}
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
                          cursor: shelf.occupied ? 'pointer' : 'default',
                          '&:hover': shelf.occupied ? {
                            transform: 'scale(1.08)',
                            boxShadow: 4,
                            bgcolor: green[600],
                          } : {
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
                <Typography variant="caption">Occupied Shelf (Clickable)</Typography>
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

      {/* Shelf Items Popover */}
      <ShelfItemsPopover
        open={Boolean(selectedShelfAnchor)}
        anchorEl={selectedShelfAnchor}
        shelf={selectedShelf}
        warehouseName={warehouse?.name}
        onClose={handleCloseShelfPopover}
        onProductSelect={handleProductSelect}
      />

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProductForModal}
      />
    </>
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

      {/* Notification Menu */}
      <NotificationMenu 
        notifications={notifications}
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
      />
    </ThemeProvider>
  );
};

export default WarehousesPage;
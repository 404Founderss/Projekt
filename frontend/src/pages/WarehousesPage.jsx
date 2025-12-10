import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { warehouseService } from '../services/warehouseService';
import { shelfService } from '../services/shelfService';
import { productService } from '../services/productService';
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
  Checkbox,
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
  ,Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { Stage, Layer, Rect } from 'react-konva';

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
const sampleWarehousesData = [
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

// Load user-saved warehouses from localStorage (created in NewWarehousePage)
const loadSavedWarehouses = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('savedWarehouses') || '[]');
    if (!Array.isArray(saved) || saved.length === 0) return [];

    return saved.map((s, idx) => {
      const shapes = (s.layout && Array.isArray(s.layout.shapes)) ? s.layout.shapes : [];
      // If the saved object already contains shelf metadata, prefer that so edits persist
      const shelves = Array.isArray(s.shelves)
        ? s.shelves.map(sh => ({ ...sh, products: Array.isArray(sh.products) ? sh.products : [] }))
        : shapes.map((shape, i) => {
            const shelfId = shape.id || `S-${idx}-${i + 1}`;
            const occupied = shape.type === 'shelf';
            const approxItems = Math.max(0, Math.floor(((shape.width || 100) * (shape.height || 40)) / 200));
            return {
              id: shelfId,
              occupied,
              items: occupied ? approxItems : 0,
              products: occupied ? generateProducts(shelfId, Math.min(20, Math.max(1, approxItems))) : []
            };
          });

      return {
        id: s.id || 100000 + idx,
        name: s.name || `Saved Warehouse ${idx + 1}`,
        capacity: 10000,
        currentStock: shelves.reduce((sum, sh) => sum + (sh.items || 0), 0),
        lastUpdate: s.createdAt || new Date().toLocaleString(),
        shelves,
        layout: { shapes },
        // keep the original saved object so we can persist updates
        __rawSaved: s
      };
    });
  } catch (e) {
    console.error('Failed to load saved warehouses', e);
    return [];
  }
};

// savedWarehouses will be loaded inside the component so UI updates when users save new layouts

// Shelf Items Popover Component
const ShelfItemsPopover = ({ open, anchorEl, shelf, warehouseName, warehouseId, onClose, onProductSelect, onShelfAddItem, onShelfRemoveItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);

  // Load products when shelf changes or popover opens
  const loadShelfProducts = useCallback(async () => {
    if (!shelf || !shelf.id) return;

    try {
      setLoadingProducts(true);
      const response = await shelfService.getProducts(shelf.id);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error loading shelf products:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [shelf]);

  useEffect(() => {
    if (open && shelf && shelf.id) {
      // If products are already loaded in shelf object, use them
      if (shelf.products && shelf.products.length > 0) {
        setProducts(shelf.products);
      } else {
        // Otherwise, fetch products from API
        loadShelfProducts();
      }
    }
  }, [open, shelf, loadShelfProducts]);

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const uniqueCategories = new Set(products.map(p => p.category));
    return Array.from(uniqueCategories);
  }, [products]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  // Local dialog state for adding/removing products from this shelf
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [removeSelection, setRemoveSelection] = useState(new Set());

  if (!shelf) return null;

  // Handlers for remove-selection toggles
  const toggleRemoveSelection = (productId) => {
    setRemoveSelection(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });
  };

  const handleConfirmRemove = () => {
    if (onShelfRemoveItem && removeSelection.size > 0) {
      onShelfRemoveItem(warehouseId, shelf.id, Array.from(removeSelection));
    }
    setRemoveSelection(new Set());
    setOpenRemoveDialog(false);
    onClose && onClose();
  };

  const handleAddProductSubmit = (product) => {
    if (onShelfAddItem) onShelfAddItem(warehouseId, shelf.id, product);
    setOpenAddDialog(false);
    onClose && onClose();
  };

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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box>
              <IconButton 
                size="small" 
                onClick={onClose}
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Open Add Product dialog */}
              <Button
                size="small"
                variant="contained"
                sx={{ bgcolor: green[600], color: 'white', '&:hover': { bgcolor: green[700] } }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenAddDialog(true);
                }}
              >
                Add Product
              </Button>

              {/* Open Remove Product selector dialog */}
              <Button
                size="small"
                variant="contained"
                sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenRemoveDialog(true);
                }}
              >
                Remove Product
              </Button>
            </Box>
          </Box>
        </Box>
        <Chip
          label={loadingProducts ? 'Loading...' : `${products.length} Products`}
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
            Showing {filteredProducts.length} of {products.length} products
          </Typography>
        </Stack>

        {/* Products List */}
        {loadingProducts ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={32} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Loading products...
            </Typography>
          </Box>
        ) : filteredProducts.length > 0 ? (
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
              {products.length === 0 ? 'No products on this shelf' : 'No matching products found'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add Product Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Product to Shelf {shelf.id}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Product Name" size="small" id="ap-name" />
            <TextField label="SKU" size="small" id="ap-sku" />
            <TextField label="Category" size="small" id="ap-cat" />
            <TextField label="Quantity" size="small" id="ap-qty" type="number" defaultValue={1} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              const name = document.getElementById('ap-name')?.value || `New Product`;
              const sku = document.getElementById('ap-sku')?.value || `SKU-${shelf.id}-${Date.now()}`;
              const category = document.getElementById('ap-cat')?.value || 'General';
              const qty = Math.max(0, Number(document.getElementById('ap-qty')?.value) || 1);
              const product = {
                id: sku,
                name,
                category,
                sku,
                quantity: qty,
                unit: 'pcs',
                status: 'Available'
              };
              handleAddProductSubmit(product);
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Product Dialog */}
      <Dialog open={openRemoveDialog} onClose={() => setOpenRemoveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Remove Products from Shelf {shelf.id}</DialogTitle>
        <DialogContent>
          {shelf.products.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No products to remove</Typography>
            </Box>
          ) : (
            <List>
              {shelf.products.map((p) => (
                <ListItem key={p.id} disablePadding>
                  <ListItemButton onClick={() => toggleRemoveSelection(p.id)}>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={removeSelection.has(p.id)} tabIndex={-1} disableRipple />
                    </ListItemIcon>
                    <ListItemText primary={p.name} secondary={`${p.sku} — ${p.quantity} ${p.unit || ''}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRemoveSelection(new Set()); setOpenRemoveDialog(false); }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleConfirmRemove()}
            disabled={removeSelection.size === 0}
          >
            Remove Selected
          </Button>
        </DialogActions>
      </Dialog>

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

      // Fetch QR code when dialog opens
      let objectUrl = null;
      const fetchQr = async () => {
        if (!product) return;
        setLoadingQr(true);
        try {
          const response = await productService.getQRCode(product.id);
          const blob = response.data;
          objectUrl = URL.createObjectURL(blob);
          setQrUrl(objectUrl);
        } catch (err) {
          console.error('QR code fetch error:', err);
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
        const response = await productService.adjustQuantity(product.id, delta);

        // Read the new quantity from response
        let newQty = productQty;
        if (response.data && typeof response.data.newQuantity === 'number') {
          newQty = response.data.newQuantity;
        } else {
          newQty = Math.max(0, productQty + delta);
        }

        setProductQty(newQty);
        setMessage({ type: 'success', text: `Quantity updated (${delta > 0 ? '+' : ''}${delta})` });
      } catch (err) {
        console.error('Quantity adjust error:', err);
        setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
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

// Konva-based layout renderer for saved warehouse shapes
const KonvaLayoutRenderer = ({ shapes = [], onRectClick }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      setSize({ width: rect.width, height: rect.height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  if (!shapes || shapes.length === 0) {
    return <Box ref={containerRef} sx={{ width: '100%', height: { xs: '40vh', sm: '50vh', md: '55vh' } }} />;
  }

  // compute bounding box of shapes
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  shapes.forEach(s => {
    const x = Number(s.x || 0);
    const y = Number(s.y || 0);
    const w = Number(s.width || 100);
    const h = Number(s.height || 40);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });
  if (!isFinite(minX)) { minX = 0; minY = 0; maxX = 100; maxY = 40; }

  const contentW = Math.max(1, maxX - minX);
  const contentH = Math.max(1, maxY - minY);
  const padding = 20;
  const scale = Math.min(
    Math.max(0.1, (size.width - padding * 2) / contentW),
    Math.max(0.1, (size.height - padding * 2) / contentH),
  ) || 1;

  const offsetX = (size.width - contentW * scale) / 2 - minX * scale;
  const offsetY = (size.height - contentH * scale) / 2 - minY * scale;

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: { xs: '40vh', sm: '50vh', md: '55vh' } }}>
      {size.width > 0 && size.height > 0 && (
        <Stage width={Math.max(100, size.width)} height={Math.max(100, size.height)}>
          <Layer>
            {shapes.map((s) => {
              const x = offsetX + (Number(s.x || 0) * scale);
              const y = offsetY + (Number(s.y || 0) * scale);
              const w = Math.max(2, (Number(s.width || 100) * scale));
              const h = Math.max(2, (Number(s.height || 40) * scale));
              const rotation = Number(s.rotation || 0);
              const isShelf = s.type === 'shelf';
              return (
                <Rect
                  key={s.id}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rotation={rotation}
                  fill={isShelf ? green[200] : '#999'}
                  stroke={isShelf ? green[800] : '#333'}
                  strokeWidth={2}
                  cornerRadius={isShelf ? 4 : 0}
                  onClick={() => { if (isShelf && onRectClick) onRectClick(s); }}
                  onTap={() => { if (isShelf && onRectClick) onRectClick(s); }}
                  perfectDrawEnabled={false}
                />
              );
            })}
          </Layer>
        </Stage>
      )}
    </Box>
  );
};

// Warehouse Visual Modal Component
const WarehouseVisualModal = ({ open, onClose, warehouse, onShelfAddItem, onShelfRemoveItem, onDeleteWarehouse }) => {
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

  // Parse floorPlanData if shelves array is empty
  let displayShelves = warehouse.shelves || [];
  let shapes = [];

  if (warehouse.floorPlanData) {
    try {
      shapes = JSON.parse(warehouse.floorPlanData);
      if (displayShelves.length === 0) {
        displayShelves = shapes
          .filter(shape => shape.type === 'shelf')
          .map((shape, index) => ({
            id: shape.id || `Shelf ${index + 1}`,
            occupied: false,
            items: 0,
            products: []
          }));
      }
    } catch (error) {
      console.error('Error parsing floorPlanData:', error);
    }
  }

  const utilization = ((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1);
  const occupiedShelves = displayShelves.filter(shelf => shelf.occupied).length;

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
                  {displayShelves.length}
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
                  {displayShelves.length - occupiedShelves}
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

          {/* Warehouse Layout: render Konva floorplan when saved layout exists */}
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
              {shapes.length > 0 ? 'Click on any shelf to view its products' : 'No layout available'}
            </Typography>

            {/* If warehouse has a saved konva layout, render it exactly; otherwise fall back to the grid */}
            {warehouse.layout && Array.isArray(warehouse.layout.shapes) && warehouse.layout.shapes.length > 0 ? (
              <Box ref={el => { /* placeholder */ }}>
                <Box
                  ref={el => { /* keep placeholder for layout */ }}
                  sx={{ width: '100%', height: { xs: '40vh', sm: '50vh', md: '55vh' }, position: 'relative' }}
                >
                      <KonvaLayoutRenderer
                        shapes={warehouse.layout.shapes}
                        onRectClick={(shape) => {
                          // only handle clicks for actual shelves (renderer will already filter non-shelves,
                          // but double-check here). Non-shelf shapes (walls) won't open popovers.
                          if (!shape || shape.type !== 'shelf') return;
                          const shelf = (warehouse.shelves || []).find(s => s.id === shape.id) || {
                            id: shape.id,
                            occupied: true,
                            items: 0,
                            products: []
                          };
                          handleShelfClick({ currentTarget: document.querySelector('[role="presentation"]') || document.body }, shelf);
                        }}
                      />
                </Box>
              </Box>
            ) : (
              // fallback: existing grid layout (unchanged)
              <> 
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

                {/* Shelves Grid (original code preserved) */}
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
                                        position: 'relative',
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
                                      {/* Add/Remove buttons moved to ShelfItemsPopover */}

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
                              position: 'relative',
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
                            {/* Add/Remove buttons moved to ShelfItemsPopover */}

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
              </>
            )}
          </Paper>

          {/* Additional Info */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Last Updated: {warehouse.lastUpdate || warehouse.updatedAt || 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Capacity: {(warehouse.capacity || 0).toLocaleString()} units |
              Current Stock: {(warehouse.currentStock || 0).toLocaleString()} units
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
        warehouseId={warehouse?.id}
        onClose={handleCloseShelfPopover}
        onProductSelect={handleProductSelect}
        onShelfAddItem={onShelfAddItem}
        onShelfRemoveItem={onShelfRemoveItem}
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
  const [savedWarehousesState, setSavedWarehousesState] = useState(() => loadSavedWarehouses());
  // Keep an editable copy of the built-in/sample warehouses so shelves can be updated in-memory
  const [sampleWarehousesState, setSampleWarehousesState] = useState(() => sampleWarehousesData.map(w => ({
    ...w,
    shelves: (w.shelves || []).map(s => ({ ...s, products: Array.isArray(s.products) ? [...s.products] : [] }))
  })));

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'savedWarehouses') {
        setSavedWarehousesState(loadSavedWarehouses());
      }
    };
    window.addEventListener('storage', onStorage);
    const onCustom = () => setSavedWarehousesState(loadSavedWarehouses());
    window.addEventListener('savedWarehousesUpdated', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('savedWarehousesUpdated', onCustom);
    };
  }, []);
  
  const [selectedPage, setSelectedPage] = useState('Warehouses');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications] = useState(sampleNotifications);

  // API state management
  const [warehousesData, setWarehousesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load warehouses from API
  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseService.getAll();

      // Transform API data to match the expected format
      const transformedData = response.data.map(warehouse => ({
        id: warehouse.id,
        name: warehouse.name,
        capacity: warehouse.capacity || 10000,
        currentStock: warehouse.currentStock || 0,
        lastUpdate: warehouse.updatedAt || new Date().toISOString(),
        shelves: warehouse.shelves || [],
        floorPlanData: warehouse.floorPlanData || null
      }));

      setWarehousesData(transformedData);
    } catch (err) {
      console.error('Error loading warehouses:', err);
      setError('Failed to load warehouses. Please try again later.');
      setWarehousesData([]);
    } finally {
      setLoading(false);
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

  const handleWarehouseClick = async (warehouse) => {
    try {
      // Fetch detailed warehouse data with shelves
      const response = await warehouseService.getById(warehouse.id);
      const detailedWarehouse = {
        ...response.data,
        shelves: response.data.shelves || [],
        floorPlanData: response.data.floorPlanData || null
      };
      setSelectedWarehouse(detailedWarehouse);
      setModalOpen(true);
    } catch (err) {
      console.error('Error loading warehouse details:', err);
      // Fallback to basic warehouse data if detailed fetch fails
      setSelectedWarehouse(warehouse);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWarehouse(null);
  };

  // Navigate to create new warehouse page
  const handleCreateWarehouse = () => {
    navigate('/warehouses/new');
  };

  // Helper to update a warehouse either in saved state or sample state
  const updateWarehouseById = (warehouseId, updater) => {
    // try saved
    const savedIdx = savedWarehousesState.findIndex(s => String(s.id) === String(warehouseId));
    if (savedIdx !== -1) {
      setSavedWarehousesState(prev => {
        const next = prev.map(p => ({ ...p }));
        next[savedIdx] = updater({ ...next[savedIdx] });
        // Persist back to localStorage, preserving original saved shape/layout fields
        try {
          const rawSaved = JSON.parse(localStorage.getItem('savedWarehouses') || '[]');
          const updated = rawSaved.map(rs => {
            if (String(rs.id) === String(warehouseId)) {
              // merge any updated shelves into a stored 'shelves' key so loader can restore them
              return { ...rs, shelves: next[savedIdx].shelves, lastUpdate: next[savedIdx].lastUpdate || rs.lastUpdate };
            }
            return rs;
          });
          localStorage.setItem('savedWarehouses', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to persist saved warehouses', e);
        }
        return next;
      });
      return;
    }

    // otherwise update sample warehouses copy
    setSampleWarehousesState(prev => {
      const idx = prev.findIndex(w => String(w.id) === String(warehouseId));
      if (idx === -1) return prev;
      const next = prev.map(p => ({ ...p }));
      next[idx] = updater({ ...next[idx] });
      return next;
    });
  };

  const handleDeleteWarehouse = (warehouse) => {
    if (!warehouse) return;
    const id = warehouse.id;
    // If it's in saved, remove from saved and persist
    if (savedWarehousesState.some(s => String(s.id) === String(id))) {
      const next = savedWarehousesState.filter(s => String(s.id) !== String(id));
      setSavedWarehousesState(next);
      try {
        const raw = JSON.parse(localStorage.getItem('savedWarehouses') || '[]');
        const updated = raw.filter(rs => String(rs.id) !== String(id));
        localStorage.setItem('savedWarehouses', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete saved warehouse', e);
      }
      // if the deleted warehouse is currently open, close the modal
      if (selectedWarehouse && String(selectedWarehouse.id) === String(id)) {
        handleCloseModal();
      }
      return;
    }

    // Otherwise remove from sample state
    setSampleWarehousesState(prev => {
      const next = prev.filter(w => String(w.id) !== String(id));
      if (selectedWarehouse && String(selectedWarehouse.id) === String(id)) {
        handleCloseModal();
      }
      return next;
    });
  };

  // Add an item to a shelf. Accepts optional `product` object.
  const handleShelfAddItem = (warehouseId, shelfId, product = null) => {
    updateWarehouseById(warehouseId, (wh) => {
      const prod = product || generateProducts(shelfId, 1)[0];
      const qty = Number(prod.quantity || 1);
      const shelves = (wh.shelves || []).map(s => {
        if (String(s.id) === String(shelfId)) {
          const newProducts = Array.isArray(s.products) ? [...s.products, prod] : [prod];
          return { ...s, products: newProducts, items: (s.items || 0) + qty, occupied: true };
        }
        return s;
      });
      const currentStock = (wh.currentStock || 0) + qty;
      return { ...wh, shelves, currentStock, lastUpdate: new Date().toLocaleString() };
    });
  };

  // Remove product(s) from a shelf. `productIds` can be an array of ids to remove.
  const handleShelfRemoveItem = (warehouseId, shelfId, productIds = null) => {
    updateWarehouseById(warehouseId, (wh) => {
      let removedQty = 0;
      const shelves = (wh.shelves || []).map(s => {
        if (String(s.id) === String(shelfId)) {
          if (!Array.isArray(s.products) || s.products.length === 0) return s;
          if (!productIds) {
            // fallback: remove last product
            const last = s.products[s.products.length - 1];
            const qty = Number(last?.quantity || 1);
            removedQty += qty;
            const newProducts = s.products.slice(0, -1);
            return { ...s, products: newProducts, items: Math.max(0, (s.items || 0) - qty), occupied: newProducts.length > 0 };
          }
          // remove selected ids
          const idSet = new Set(productIds.map(id => String(id)));
          const newProducts = s.products.filter(p => {
            if (idSet.has(String(p.id))) {
              removedQty += Number(p.quantity || 1);
              return false;
            }
            return true;
          });
          // we already computed removedQty; ensure items reflect total quantity
          const newItems = Math.max(0, (s.items || 0) - removedQty);
          return { ...s, products: newProducts, items: newItems, occupied: newProducts.length > 0 };
        }
        return s;
      });
      const currentStock = Math.max(0, (wh.currentStock || 0) - removedQty);
      return { ...wh, shelves, currentStock, lastUpdate: new Date().toLocaleString() };
    });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Warehouses', icon: <WarehouseIcon />, path: '/warehouses' },
    { text: 'New warehouse', icon: <NewWarehouseIcon />, path: '/warehouses/new' },
    { text: 'Statistics', icon: <StatisticsIcon />, path: '/statistics' },
  ];

  // Combine saved warehouses with editable sample data and calculate summary statistics
  const allWarehousesData = [...savedWarehousesState, ...warehousesData, ...sampleWarehousesState];
  const totalWarehouses = allWarehousesData.length;
  const totalCapacity = allWarehousesData.reduce((sum, wh) => sum + (wh.capacity || 0), 0);
  const totalStock = allWarehousesData.reduce((sum, wh) => sum + (wh.currentStock || 0), 0);
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
          
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography 
                      variant="h4" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.75rem', sm: '2.125rem' }
                      }}
                    >
                      Warehouses
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateWarehouse}>
                        Create Warehouse
                      </Button>
                    </Box>
                  </Box>

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

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', width: '100%' }}>
              <CircularProgress />
            </Box>
          )}

          {/* Warehouses List */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {allWarehousesData.map((warehouse) => {
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
                            {(warehouse.capacity || 0).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Current Stock
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {(warehouse.currentStock || 0).toLocaleString()}
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
                        Last Update: {warehouse.lastUpdate || warehouse.updatedAt || 'N/A'}
                      </Typography>
                      
                              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ 
                                  color: 'primary.main', 
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}>
                                  Click to view layout →
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); setWarehouseToDelete(warehouse); setDeleteConfirmOpen(true); }}
                                  sx={{ ml: 1 }}
                                  title="Delete warehouse"
                                >
                                  <DeleteIcon />
                                </IconButton>
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
        onShelfAddItem={handleShelfAddItem}
        onShelfRemoveItem={handleShelfRemoveItem}
        onDeleteWarehouse={handleDeleteWarehouse}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setWarehouseToDelete(null); }}
        maxWidth="xs"
      >
        <DialogTitle>Delete Warehouse</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{warehouseToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteConfirmOpen(false); setWarehouseToDelete(null); }}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (warehouseToDelete) handleDeleteWarehouse(warehouseToDelete);
              setDeleteConfirmOpen(false);
              setWarehouseToDelete(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { warehouseService } from '../services/warehouseService';
import { shelfService } from '../services/shelfService';
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



// Notification Menu Component
const NotificationMenu = ({ notifications, open, anchorEl, onClose }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

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

      // Calculate capacity from shelves (exclude walls, use maxCapacity or default 1000)
      const calculatedCapacity = shelves
        .filter(sh => sh.type === 'shelf')
        .reduce((sum, sh) => sum + (sh.maxCapacity || 1000), 0);

      return {
        id: s.id || 100000 + idx,
        name: s.name || `Saved Warehouse ${idx + 1}`,
        capacity: calculatedCapacity > 0 ? calculatedCapacity : 10000,
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

      // Resolve the actual shelf DB id; shelf.id may be a shape id if not yet mapped
      let shelfIdToUse = shelf.id;

      // if not a number, try to resolve via shapeId endpoint
      if (shelfIdToUse && isNaN(Number(shelfIdToUse))) {
        try {
          const res = await shelfService.getByShapeId(shelfIdToUse);
          shelfIdToUse = res.data?.id || shelfIdToUse;
        } catch (e) {
          console.warn('Could not resolve shelf by shapeId', shelfIdToUse, e);
        }
      }

      const response = await shelfService.getProducts(shelfIdToUse);
      const normalized = (response.data || []).map((p) => ({
        ...p,
        // keep UI-friendly fields available
        quantity: p.quantity ?? p.currentStock ?? 0,
        unit: p.unit || 'pcs',
        category: p.categoryName || 'Uncategorized',
        status: p.status || ((p.currentStock ?? p.quantity ?? 0) > 0 ? 'Available' : 'Reserved'),
      }));
      console.log('Loaded products for shelf', shelfIdToUse, normalized);
      setProducts(normalized);
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
        const normalized = shelf.products.map((p) => ({
          ...p,
          quantity: p.quantity ?? p.currentStock ?? 0,
          unit: p.unit || 'pcs',
          category: p.categoryName || 'Uncategorized',
          status: p.status || ((p.currentStock ?? p.quantity ?? 0) > 0 ? 'Available' : 'Reserved'),
        }));
        setProducts(normalized);
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
            {filteredProducts.map((product) => {
              const qty = product.quantity ?? product.currentStock ?? 0;
              const unit = product.unit || 'pcs';
              const status = product.status || (qty > 0 ? 'Available' : 'Reserved');
              return (
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
                    label={status}
                    size="small"
                    color={status === 'Available' ? 'success' : 'warning'}
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
                      {qty} {unit}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
            })}
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
              const category = document.getElementById('ap-cat')?.value || 'General';
              const qty = Math.max(0, Number(document.getElementById('ap-qty')?.value) || 1);
              const product = {
                id: `temp-${Date.now()}`,
                name,
                category,
                sku: null,
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
          {products.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No products to remove</Typography>
            </Box>
          ) : (
            <List>
              {products.map((p) => (
                <ListItem key={p.id} disablePadding>
                  <ListItemButton onClick={() => toggleRemoveSelection(p.id)}>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={removeSelection.has(p.id)} tabIndex={-1} disableRipple />
                    </ListItemIcon>
                    <ListItemText primary={p.name} secondary={`${p.sku || 'SKU auto'} — ${(p.quantity ?? p.currentStock ?? 0)} ${p.unit || 'pcs'}`} />
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
  const ProductDetailDialog = ({ open, onClose, product, onQuantityAdjusted }) => {
    const [qtyInput, setQtyInput] = useState(1);
    const [qrUrl, setQrUrl] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);
    const [adjusting, setAdjusting] = useState(false);
    const [message, setMessage] = useState(null);
    const [productQty, setProductQty] = useState(product ? (product.quantity ?? product.currentStock ?? 0) : 0);

    useEffect(() => {
      setProductQty(product ? (product.quantity ?? product.currentStock ?? 0) : 0);
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
        const newStatus = (response.data && response.data.status)
          ? response.data.status
          : (newQty > 0 ? 'Available' : 'Reserved');

        setProductQty(newQty);
        if (onQuantityAdjusted && product) {
          onQuantityAdjusted(product.id, newQty, product.shelfId, newStatus);
        }
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
const WarehouseVisualModal = ({ open, onClose, warehouse, onShelfAddItem, onShelfRemoveItem, onDeleteWarehouse, onShelfQuantityAdjusted }) => {
  const [selectedShelfAnchor, setSelectedShelfAnchor] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const handleQuantityAdjusted = (productId, newQty, shelfId, newStatus) => {
    // Update selected shelf products so popover shows fresh quantity without reload
    setSelectedShelf((prev) => {
      if (!prev) return prev;
      const updatedProducts = (prev.products || []).map((p) =>
        String(p.id) === String(productId)
          ? { ...p, quantity: newQty, currentStock: newQty, status: newStatus }
          : p
      );
      return { ...prev, products: updatedProducts };
    });

    if (onShelfQuantityAdjusted) {
      onShelfQuantityAdjusted(productId, newQty, shelfId, newStatus);
    }

    // Keep modal product in sync
    setSelectedProductForModal((prev) =>
      prev && String(prev.id) === String(productId)
        ? { ...prev, quantity: newQty, currentStock: newQty, status: newStatus }
        : prev
    );
  };

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
  let allShelvesAndWalls = warehouse.shelves || [];
  // Filter out walls - only keep actual shelves
  let displayShelves = allShelvesAndWalls.filter(item => item.type === 'shelf');
  let shapes = [];

  if (warehouse.floorPlanData) {
    try {
      let parsedData = JSON.parse(warehouse.floorPlanData);
      // Handle both formats: array directly or object with shapes property
      shapes = Array.isArray(parsedData) ? parsedData : (parsedData.shapes || []);
      
      // Cross-reference displayShelves with shapes to exclude walls
      // If a shelf's shapeId matches a wall shape, exclude it
      displayShelves = displayShelves.filter(shelf => {
        const matchingShape = shapes.find(shape => 
          String(shape.id) === String(shelf.shapeId) || String(shape.id) === String(shelf.id)
        );
        // If we found the matching shape, check if it's actually a wall
        if (matchingShape) {
          return matchingShape.type === 'shelf';
        }
        // If no matching shape found, assume it's a shelf based on height (walls are typically 10-20px high, shelves 40+)
        return !shelf.height || shelf.height > 20;
      });
      
      if (displayShelves.length === 0) {
        displayShelves = shapes
          .filter(shape => shape.type === 'shelf')
          .map((shape, index) => ({
            id: shape.id || `Shelf ${index + 1}`,
            type: 'shelf',
            occupied: false,
            items: 0,
            products: []
          }));
      }
    } catch (error) {
      console.error('Error parsing floorPlanData:', error);
    }
  }

  const capacity = warehouse.capacity || 0;
  const currentStock = warehouse.currentStock || 0;
  const utilization = capacity > 0 ? ((currentStock / capacity) * 100).toFixed(1) : '0.0';
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
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {displayShelves.length}
                </Typography>
                <Typography variant="caption">Total Shelves</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: green[600], color: 'white' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {occupiedShelves}
                </Typography>
                <Typography variant="caption">Occupied</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.400', color: 'white' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {displayShelves.length - occupiedShelves}
                </Typography>
                <Typography variant="caption">Empty</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
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
            {shapes.length > 0 ? (
              <Box ref={el => { /* placeholder */ }}>
                <Box
                  ref={el => { /* keep placeholder for layout */ }}
                  sx={{ width: '100%', height: { xs: '40vh', sm: '50vh', md: '55vh' }, position: 'relative' }}
                >
                      <KonvaLayoutRenderer
                        shapes={shapes}
                        onRectClick={(shape) => {
                          // only handle clicks for actual shelves (renderer will already filter non-shelves,
                          // but double-check here). Non-shelf shapes (walls) won't open popovers.
                          if (!shape || shape.type !== 'shelf') return;
                          const shelf = (warehouse.shelves || []).find(s =>
                            String(s.shapeId) === String(shape.id) || String(s.id) === String(shape.id)
                          ) || {
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
                  <Grid size={{ xs: 5.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                      Aisle A-B
                    </Typography>
                    <Grid container spacing={1}>
                              {warehouse.shelves.slice(0, 6).map((shelf) => (
                                  <Grid size={{ xs: 4 }} key={shelf.id}>
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
                  <Grid size={{ xs: 1 }} sx={{ 
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
                  <Grid size={{ xs: 5.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                      Aisle C-D
                    </Typography>
                    <Grid container spacing={1}>
                      {warehouse.shelves.slice(6, 12).map((shelf) => (
                        <Grid size={{ xs: 4 }} key={shelf.id}>
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
        onQuantityAdjusted={handleQuantityAdjusted}
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
  const [notifications, setNotifications] = useState([]);

  // API state management
  const [warehousesData, setWarehousesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load warehouses from API
  useEffect(() => {
    loadWarehouses();
    loadNotifications();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseService.getAll();

      // Transform API data to match the expected format
      const transformedData = await Promise.all(response.data.map(async (warehouse) => {
        // Calculate capacity from sum of shelf maxCapacity (exclude walls)
        const shelves = warehouse.shelves || [];
        const calculatedCapacity = shelves
          .filter(shelf => shelf.type === 'shelf')
          .reduce((sum, shelf) => sum + (shelf.maxCapacity || 1000), 0);
        
        // Calculate current stock from products in all shelves
        let calculatedStock = 0;
        try {
          const shelvesOnly = shelves.filter(shelf => shelf.type === 'shelf');
          const stockPromises = shelvesOnly.map(async (shelf) => {
            try {
              const productsResponse = await shelfService.getProducts(shelf.id);
              return (productsResponse.data || []).reduce((sum, p) => 
                sum + (p.currentStock ?? p.quantity ?? 0), 0
              );
            } catch {
              return 0;
            }
          });
          const stockValues = await Promise.all(stockPromises);
          calculatedStock = stockValues.reduce((sum, val) => sum + val, 0);
        } catch (err) {
          console.error(`Error calculating stock for warehouse ${warehouse.id}:`, err);
        }
        
        return {
          id: warehouse.id,
          name: warehouse.name,
          capacity: calculatedCapacity > 0 ? calculatedCapacity : (warehouse.capacity || 0),
          currentStock: calculatedStock,
          lastUpdate: warehouse.updatedAt || new Date().toISOString(),
          shelves: warehouse.shelves || [],
          floorPlanData: warehouse.floorPlanData || null
        };
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

  const loadNotifications = async () => {
    try {
      const notificationsResponse = await notificationService.getUnread();
      const apiNotifications = notificationsResponse.data || [];
      setNotifications(apiNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
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

  const handleWarehouseClick = async (warehouse) => {
    try {
      // Fetch detailed warehouse data with shelves
      const response = await warehouseService.getById(warehouse.id);
      const detailedWarehouse = {
        ...response.data,
        shelves: response.data.shelves || [],
        floorPlanData: response.data.floorPlanData || null
      };

      // Load products for each shelf
      if (detailedWarehouse.shelves && detailedWarehouse.shelves.length > 0) {
        const shelvesWithProducts = await Promise.all(
          detailedWarehouse.shelves.map(async (shelf) => {
            try {
              const productsResponse = await shelfService.getProducts(shelf.id);
              const products = (productsResponse.data || []).map((p) => ({
                ...p,
                quantity: p.quantity ?? p.currentStock ?? 0,
                unit: p.unit || 'pcs',
                category: p.categoryName || 'Uncategorized',
                status: p.status || ((p.currentStock ?? p.quantity ?? 0) > 0 ? 'Available' : 'Reserved'),
              }));
              return {
                ...shelf,
                products,
                items: products.reduce((sum, p) => sum + (p.currentStock ?? p.quantity ?? 0), 0),
                occupied: products.length > 0
              };
            } catch (err) {
              console.error(`Error loading products for shelf ${shelf.id}:`, err);
              return {
                ...shelf,
                products: [],
                items: 0,
                occupied: false
              };
            }
          })
        );
        detailedWarehouse.shelves = shelvesWithProducts;
        
        // Calculate actual current stock from all products in all shelves
        const totalStock = shelvesWithProducts.reduce((sum, shelf) => 
          sum + (shelf.items || 0), 0
        );
        detailedWarehouse.currentStock = totalStock;
        
        // Calculate total capacity from all shelves (exclude walls)
        const totalCapacity = shelvesWithProducts
          .filter(shelf => shelf.type === 'shelf')
          .reduce((sum, shelf) => sum + (shelf.maxCapacity || 1000), 0);
        detailedWarehouse.capacity = totalCapacity > 0 ? totalCapacity : detailedWarehouse.capacity;
      }

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
    // Update the warehouse in the list with the latest data from the modal
    if (selectedWarehouse) {
      const updatedWarehouse = {
        id: selectedWarehouse.id,
        name: selectedWarehouse.name,
        capacity: selectedWarehouse.capacity,
        currentStock: selectedWarehouse.currentStock,
        lastUpdate: selectedWarehouse.lastUpdate || selectedWarehouse.updatedAt,
        shelves: selectedWarehouse.shelves,
        floorPlanData: selectedWarehouse.floorPlanData
      };

      // Update in warehousesData (from API)
      setWarehousesData(prev => 
        prev.map(wh => wh.id === selectedWarehouse.id ? updatedWarehouse : wh)
      );

      // Update in savedWarehousesState (from localStorage) if it exists there
      setSavedWarehousesState(prev => 
        prev.map(wh => wh.id === selectedWarehouse.id ? { ...wh, ...updatedWarehouse } : wh)
      );
    }

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

    // Sample warehouses are no longer supported - all updates go through backend
  };

  const handleDeleteWarehouse = async (warehouse) => {
    if (!warehouse) return;
    const id = warehouse.id;
    
    try {
      // Delete from backend
      await warehouseService.delete(id);
      
      // Update local state - remove from both saved and api warehouses
      setSavedWarehousesState(prev => prev.filter(s => String(s.id) !== String(id)));
      setWarehousesData(prev => prev.filter(w => String(w.id) !== String(id)));
      
      // Try to remove from localStorage if it was saved there
      try {
        const raw = JSON.parse(localStorage.getItem('savedWarehouses') || '[]');
        const updated = raw.filter(rs => String(rs.id) !== String(id));
        localStorage.setItem('savedWarehouses', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }
      
      // Close modal if the deleted warehouse is currently open
      if (selectedWarehouse && String(selectedWarehouse.id) === String(id)) {
        handleCloseModal();
      }
    } catch (error) {
      console.error('Failed to delete warehouse:', error);
      alert('Failed to delete warehouse. Please try again.');
    }
  };

  // Add an item to a shelf (persist to backend)
  const handleShelfAddItem = async (warehouseId, shelfId, product = null) => {
    try {
      // Prefer the currently selected warehouse because it has shelves/products loaded
      const warehouse = selectedWarehouse && String(selectedWarehouse.id) === String(warehouseId)
        ? selectedWarehouse
        : allWarehousesData.find(w => String(w.id) === String(warehouseId));

      if (!warehouse) {
        console.error('Warehouse not found');
        alert('Warehouse not found');
        return;
      }

      // shelfId coming from UI is the display id (e.g., "Shelf 1"); DB shelf id is in shelf.id
      let dbShelf = null;
      if (warehouse.shelves && warehouse.shelves.length > 0) {
        dbShelf = warehouse.shelves.find(s => String(s.id) === String(shelfId));
      }

      if (!dbShelf) {
        // Try to create shelf in backend based on floorPlanData
        try {
          let shapes = [];
          if (warehouse.floorPlanData) {
            const parsed = JSON.parse(warehouse.floorPlanData);
            shapes = Array.isArray(parsed) ? parsed : (parsed.shapes || []);
          }
          const shape = shapes.find(sh => String(sh.id) === String(shelfId));
          if (!shape) {
            console.error('Shelf shape not found for fallback creation', { shelfId, shapes });
            alert('Shelf not found. Please refresh and try again.');
            return;
          }
          const newShelf = {
            warehouseId,
            shapeId: shape.id,
            type: 'shelf',
            code: `SHELF-${warehouse.code || warehouseId}-${shelfId}`,
            name: `Shelf ${shelfId}`,
            positionX: shape.x || 0,
            positionY: shape.y || 0,
            width: shape.width || 120,
            height: shape.height || 40,
            rotation: shape.rotation || 0,
            maxCapacity: 1000,
            capacityUnit: 'pcs'
          };
          const createResp = await shelfService.create(newShelf);
          dbShelf = createResp.data;
        } catch (e) {
          console.error('Failed to create shelf on the fly', e);
          alert('Shelf not found and could not create it. Please refresh.');
          return;
        }
      }

      const actualShelfId = dbShelf.id; // database id

      const prod = product || generateProducts(shelfId, 1)[0];
      const productData = {
        companyId: 1,
        shelfId: actualShelfId,
        name: prod.name,
        unit: prod.unit || 'pcs',
        currentStock: prod.quantity || 1,
        categoryName: prod.category || 'General',
        description: prod.description || '',
        currency: 'HUF'
      };

      if (prod.sku) {
        productData.sku = prod.sku;
      }

      await productService.create(productData);
      // refresh warehouse details to reflect changes
      await handleWarehouseClick(warehouse);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert(`Failed to add product: ${error.response?.data?.error || error.message}`);
    }
  };

  // Remove product(s) from a shelf (persist to backend)
  const handleShelfRemoveItem = async (warehouseId, shelfId, productIds = null) => {
    try {
      if (!productIds || productIds.length === 0) return;

      // Delete products from backend
      for (const productId of productIds) {
        try {
          await productService.delete(productId);
        } catch (err) {
          console.error(`Failed to delete product ${productId}:`, err);
        }
      }

      // reload warehouse details
      const warehouse = selectedWarehouse && String(selectedWarehouse.id) === String(warehouseId)
        ? selectedWarehouse
        : allWarehousesData.find(w => String(w.id) === String(warehouseId));
      if (warehouse) {
        await handleWarehouseClick(warehouse);
      }
      alert('Product(s) removed successfully!');
    } catch (error) {
      console.error('Failed to remove products:', error);
      alert(`Failed to remove products: ${error.message}`);
    }
  };

  const handleShelfQuantityAdjusted = (productId, newQty, shelfId, newStatus) => {
    setSelectedWarehouse((prev) => {
      if (!prev || !prev.shelves) return prev;
      const updatedShelves = prev.shelves.map((s) => {
        if (String(s.id) !== String(shelfId) && String(s.shapeId) !== String(shelfId)) return s;
        const updatedProducts = (s.products || []).map((p) =>
          String(p.id) === String(productId)
            ? { ...p, quantity: newQty, currentStock: newQty, status: newStatus }
            : p
        );
        const items = updatedProducts.reduce((sum, p) => sum + (p.currentStock ?? p.quantity ?? 0), 0);
        return { ...s, products: updatedProducts, items, occupied: updatedProducts.length > 0 };
      });
      
      // Recalculate total currentStock for the warehouse
      const totalStock = updatedShelves.reduce((sum, shelf) => sum + (shelf.items || 0), 0);
      
      return { ...prev, shelves: updatedShelves, currentStock: totalStock };
    });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Warehouses', icon: <WarehouseIcon />, path: '/warehouses' },
    { text: 'New warehouse', icon: <NewWarehouseIcon />, path: '/warehouses/new' },
    { text: 'Statistics', icon: <StatisticsIcon />, path: '/statistics' },
  ];

  // Use only warehouses from the backend API
  const allWarehousesData = [...savedWarehousesState, ...warehousesData];
  const totalWarehouses = allWarehousesData.length;
  const totalCapacity = allWarehousesData.reduce((sum, wh) => sum + (wh.capacity || 0), 0);
  const totalStock = allWarehousesData.reduce((sum, wh) => sum + (wh.currentStock || 0), 0);
  const averageUtilization = totalCapacity > 0 ? ((totalStock / totalCapacity) * 100).toFixed(1) : '0.0';

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
              <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              const utilization = warehouse.capacity > 0 
                ? ((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)
                : '0.0';

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={warehouse.id}>
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
        onShelfQuantityAdjusted={handleShelfQuantityAdjusted}
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

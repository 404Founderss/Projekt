// src/pages/NewWarehousePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { warehouseService } from '../services/warehouseService';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import { notificationService } from '../services/notificationService';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, IconButton, Avatar,
  Divider, CssBaseline, Badge, Paper, Button, TextField,
  Menu, MenuItem, Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon, AccountCircle as ProfileIcon,
  Warehouse as WarehouseIcon, AddBusiness as NewWarehouseIcon,
  BarChart as StatisticsIcon, Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

// --- GRAFIKUS (KONVA) IMPORTOK ---
import { Stage, Layer, Rect, Transformer } from 'react-konva';

// --- TÉMA ÉS LAYOUT KONSTANSOK ---
const drawerWidth = 260;
const theme = createTheme({
  palette: {
    primary: { main: green[800] },
    secondary: { main: '#ffffff' },
    background: { default: '#f4f6f8' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});



// --- NOTIFICATION MENU COMPONENT ---
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

// --- Méretezhető Alakzat Komponens (UPDATED ROTATION) ---
const ResizableShape = ({ shape, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = (e) => {
    const node = shapeRef.current;
    if (!node) return;
    
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale to 1 and adjust width/height to avoid scaling effects on stroke
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...shape,
      x: node.x(),
      y: node.y(),
      // We save the rotation as it is returned by the transformer (which will be snapped)
      rotation: node.rotation(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shape}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={handleTransformEnd}
        fill={shape.type === 'shelf' ? green[200] : '#555555'}
        stroke={shape.type === 'shelf' ? green[800] : '#000000'}
        strokeWidth={2}
        shadowBlur={isSelected ? 10 : 5}
        shadowOpacity={isSelected ? 0.8 : 0.5}
        cornerRadius={shape.type === 'shelf' ? 4 : 0}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          // --- UPDATE: SNAP ROTATION TO 90 DEGREES ---
          rotationSnaps={[0, 90, 180, 270]} 
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};


// --- FŐ KOMPONENS: NewWarehousePage ---
const NewWarehousePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPage, setSelectedPage] = useState('New warehouse');
  const [warehouseName, setWarehouseName] = useState('');
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // Notification State
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const stageContainerRef = useRef(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  // === MÉRETFIGYELŐ (ResizeObserver) ===
  useEffect(() => {
    if (!stageContainerRef.current) {
      return;
    }
    const container = stageContainerRef.current;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setStageSize({ width, height });
      }
    });
    observer.observe(container);
    return () => observer.unobserve(container);
  }, []);

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Notification Handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Warehouses', icon: <WarehouseIcon />, path: '/warehouses' },
    { text: 'New warehouse', icon: <NewWarehouseIcon />, path: '/warehouses/new' },
    { text: 'Statistics', icon: <StatisticsIcon />, path: '/statistics' },
  ];

  // --- DRAWER TARTALMA (OLDALSÓ MENÜ) ---
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
              onClick={() => setSelectedPage(item.text)}
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
                borderRadius: 2, mx: 1.5, my: 1,
                '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
                '& .MuiListItemIcon-root': { color: 'secondary.main' },
              }}
            >
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  
  // --- Elem hozzáadása ---
  const handleAddShape = (type) => {
    const newShape = {
      id: `shape-${Date.now()}`,
      type: type,
      x: 100, y: 100, rotation: 0,
      width: type === 'shelf' ? 120 : 150,
      height: type === 'shelf' ? 40 : 10,
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedId(newShape.id);
  };
  
  // --- Konva eseménykezelők ---
  const handleShapeChange = (newAttrs) => {
    setShapes(shapes.map(shape => 
      shape.id === newAttrs.id ? newAttrs : shape
    ));
  };
  
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  // --- Mentés / Törlés ---
  const handleSave = async () => {
    if (!shapes || shapes.length === 0) {
      alert('Please add at least one shelf or wall to the layout before saving.');
      return;
    }

    if (!warehouseName) {
      alert('Please enter a name for the warehouse.');
      return;
    }

    try {
      // Prepare data for backend
      const warehouseData = {
        companyId: 1, // Default company ID - can be changed based on user's company
        name: warehouseName,
        code: `W-${Date.now()}`, // Generate a unique code
        floorPlanData: JSON.stringify(shapes), // Store shapes array directly as JSON
        description: `Created on ${new Date().toLocaleString()}`
      };

      // Call backend API to create warehouse
      const response = await warehouseService.create(warehouseData);
      
      console.log('--- WAREHOUSE SAVED TO DATABASE ---', response.data);
      alert(`Warehouse '${warehouseName}' saved successfully!`);
      
      // Redirect to warehouses page
      navigate('/warehouses');
    } catch (error) {
      console.error('Failed to save warehouse to database:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setShapes([]);
      setSelectedId(null);
      setWarehouseName('');
    }
  };

  // --- Kiválasztott elem törlése ---
  const handleRemoveSelected = () => {
    if (!selectedId) {
      alert('Please select a shelf or wall to remove.');
      return;
    }
    setShapes(shapes.filter(shape => shape.id !== selectedId));
    setSelectedId(null);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* --- APPBAR ÉS DRAWER --- */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          backgroundColor: 'secondary.main', 
          color: 'text.primary', 
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)' 
        }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          
          {/* NOTIFICATION ICON */}
          <IconButton 
            size="large" 
            aria-label="show new notifications" 
            onClick={handleNotificationClick}
            sx={{ 
              backgroundColor: 'primary.main', 
              color: 'secondary.main', 
              '&:hover': { backgroundColor: 'primary.dark' } 
            }}>
            <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer 
        variant="permanent" 
        anchor="left" 
        sx={{ 
          width: drawerWidth, 
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            backgroundColor: 'primary.main', 
            borderRight: 'none' 
          } 
        }}>
        {drawerContent}
      </Drawer>

      {/* --- FŐ TARTALOM (KONVA VÁSZONNAL) --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        <Toolbar /> 
        
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Create New Warehouse
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 1. Vezérlő sáv és Eszköztár */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
            <Paper sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              borderRadius: 3, 
              boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)', 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              flex: 1,
              minWidth: { xs: '100%', sm: '300px' }
            }}>
              <TextField 
                label="Warehouse Name" 
                variant="outlined" 
                size="small" 
                value={warehouseName} 
                onChange={(e) => setWarehouseName(e.target.value)} 
                sx={{ flexGrow: 1 }} 
                fullWidth
              />
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSave}
                  disabled={shapes.length === 0}
                  fullWidth={false}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  Save Layout
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleClear}
                  fullWidth={false}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  Clear Layout
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              borderRadius: 3, 
              boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2
            }}>
              <Typography 
                variant="body1" 
                sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
              >
                Toolbox:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => handleAddShape('shelf')}
                  size="small"
                  fullWidth={false}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  + Add Shelf
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={() => handleAddShape('wall')}
                  size="small"
                  fullWidth={false}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  + Add Wall
                </Button>

                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleRemoveSelected}
                  size="small"
                  disabled={!selectedId}
                  fullWidth={false}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  Remove Selected
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* 2. RAJZVÁSZON (KONVA) */}
          <Box 
            ref={stageContainerRef}
            id="canvas-container"
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)',
              height: { xs: '50vh', sm: '60vh', md: '70vh', lg: '72vh' },
              width: '100%',
              border: '2px dashed #ccc',
              backgroundColor: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              margin: '0 auto'
            }}
          >
                {stageSize.width > 0 && (
                  <Stage
                    ref={stageRef}
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}
                  >
                    <Layer>
                      {shapes.map((shape) => (
                        <ResizableShape
                          key={shape.id}
                          shape={shape}
                          isSelected={shape.id === selectedId}
                          onSelect={() => {
                            setSelectedId(shape.id);
                          }}
                          onChange={handleShapeChange}
                        />
                      ))}
                    </Layer>
                  </Stage>
                )}
                
            {shapes.length === 0 && (
              <Typography sx={{ 
                color: 'text.secondary', 
                textAlign: 'center', 
                position: 'absolute', 
                top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: 2
              }}>
                Click '+ Add Shelf' or '+ Add Wall' to start drawing
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Notification Menu Component Instance */}
      <NotificationMenu 
        notifications={notifications} 
        open={Boolean(notificationAnchorEl)} 
        anchorEl={notificationAnchorEl} 
        onClose={handleNotificationClose} 
      />

    </Box>
  );
};

// --- Export ---
const NewWarehousePageWithTheme = () => (
  <ThemeProvider theme={theme}>
    <NewWarehousePage />
  </ThemeProvider>
);

export default NewWarehousePageWithTheme;
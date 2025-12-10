import api from './api';

export const notificationService = {
  // Get all notifications for current user
  getAll: () => api.get('/api/notifications'),

  // Get unread notifications for current user
  getUnread: () => api.get('/api/notifications/unread'),

  // Get unread count
  getUnreadCount: () => api.get('/api/notifications/unread-count'),

  // Mark notification as read
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () => api.put('/api/notifications/mark-all-read'),
};

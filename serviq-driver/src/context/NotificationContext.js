import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../services/api';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestAlert, setLatestAlert] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      console.warn('Failed to load notifications:', e.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      // Listen for real-time events via Socket.IO
      const unsubIssue = socketService.on('new_issue_reported', (data) => {
        if (data?.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          setUnreadCount((c) => c + 1);
          setLatestAlert({
            title: data.notification.title || 'New Issue Alert',
            message: data.notification.message,
          });
        }
      });

      const unsubRepair = socketService.on('repair_status_updated', (data) => {
        if (data?.repair) {
          const alertMsg = `Repair #${data.repair._id?.slice(-4)} status updated to ${data.repair.status?.toUpperCase()}`;
          setLatestAlert({
            title: 'Repair Status Update',
            message: alertMsg,
          });
          fetchNotifications();
        }
      });

      const unsubOdo = socketService.on('odometer_updated', () => {
        fetchNotifications();
      });

      return () => {
        unsubIssue();
        unsubRepair();
        unsubOdo();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLatestAlert(null);
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      console.warn('Failed to mark notification read:', e.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.warn('Failed to mark all notifications read:', e.message);
    }
  };

  const dismissAlert = () => setLatestAlert(null);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        latestAlert,
        dismissAlert,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

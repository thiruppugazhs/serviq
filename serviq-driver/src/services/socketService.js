import { io } from 'socket.io-client';
import { authStorage } from './authStorage';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  async connect(organizationId) {
    if (this.socket && this.socket.connected) {
      if (organizationId) {
        this.socket.emit('join_org', organizationId);
      }
      return;
    }

    try {
      const baseUrl = await authStorage.getBaseUrl();

      this.socket = io(baseUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('[Socket.IO] Connected to server, ID:', this.socket.id);
        if (organizationId) {
          this.socket.emit('join_org', organizationId);
          console.log('[Socket.IO] Joined organization room:', organizationId);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[Socket.IO] Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.warn('[Socket.IO] Connection error:', error.message);
      });

      // Forward real-time events
      const events = [
        'new_issue_reported',
        'repair_status_updated',
        'odometer_updated',
        'notification_created',
      ];

      events.forEach((evt) => {
        this.socket.on(evt, (data) => {
          this.notifyListeners(evt, data);
        });
      });
    } catch (e) {
      console.warn('[Socket.IO] Init error:', e.message);
    }
  }

  disconnect(organizationId) {
    if (this.socket) {
      if (organizationId) {
        this.socket.emit('leave_org', organizationId);
      }
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
      }
    };
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in socket listener for ${event}:`, err);
        }
      });
    }
  }
}

export const socketService = new SocketService();

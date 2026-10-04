import { authStorage } from './authStorage';
import { APP_CONFIG } from '../constants/config';

class ApiService {
  constructor() {
    this.token = null;
    this.onUnauthorized = null;
  }

  setToken(token) {
    this.token = token;
  }

  setOnUnauthorized(callback) {
    this.onUnauthorized = callback;
  }

  async request(endpoint, options = {}) {
    const baseUrl = await authStorage.getBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = {
      ...(options.headers || {}),
    };

    // If not FormData, default to application/json
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Attach JWT if available
    const token = this.token || (await authStorage.getToken());
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.apiTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP status
      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        if (response.status === 401) {
          if (this.onUnauthorized) {
            this.onUnauthorized();
          }
          throw new Error(data.message || 'Session expired. Please log in again.');
        }

        const errorMessage = data.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Connection timed out. Please check your internet connection.');
      }
      throw error;
    }
  }

  // ==================== AUTH APIS ====================

  async login(identifier, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: identifier, password }),
    });
  }

  async getMe() {
    return this.request('/api/auth/me', {
      method: 'GET',
    });
  }

  // ==================== DRIVER PORTAL APIS ====================

  async getDriverProfile() {
    return this.request('/api/driver/profile', {
      method: 'GET',
    });
  }

  async updateDriverProfile(formDataOrObject) {
    if (formDataOrObject instanceof FormData) {
      return this.request('/api/driver/profile', {
        method: 'PATCH',
        body: formDataOrObject,
      });
    }
    return this.request('/api/driver/profile', {
      method: 'PATCH',
      body: JSON.stringify(formDataOrObject),
    });
  }

  async getAssignedVehicle() {
    return this.request('/api/driver/vehicle', {
      method: 'GET',
    });
  }

  async getVehicleHealth() {
    return this.request('/api/driver/vehicle/health', {
      method: 'GET',
    });
  }

  async getVehicleMaintenance() {
    return this.request('/api/driver/vehicle/maintenance', {
      method: 'GET',
    });
  }

  async getVehicleServiceHistory() {
    return this.request('/api/driver/vehicle/service-history', {
      method: 'GET',
    });
  }

  async getVehicleDocuments() {
    return this.request('/api/driver/vehicle/documents', {
      method: 'GET',
    });
  }

  async getOdometerHistory() {
    return this.request('/api/driver/odometer', {
      method: 'GET',
    });
  }

  async updateOdometer(newOdometer, notes = '') {
    return this.request('/api/driver/odometer', {
      method: 'POST',
      body: JSON.stringify({ newOdometer, notes }),
    });
  }

  async getIssues() {
    return this.request('/api/driver/issues', {
      method: 'GET',
    });
  }

  async reportIssue(formData) {
    return this.request('/api/driver/issues', {
      method: 'POST',
      body: formData,
    });
  }

  async getRepairs() {
    return this.request('/api/driver/repairs', {
      method: 'GET',
    });
  }

  async getRepairById(id) {
    return this.request(`/api/driver/repairs/${id}`, {
      method: 'GET',
    });
  }

  async getNotifications() {
    return this.request('/api/driver/notifications', {
      method: 'GET',
    });
  }

  async markNotificationRead(id) {
    return this.request(`/api/driver/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/api/driver/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

export const api = new ApiService();

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG, DEFAULT_API_URL } from '../constants/config';

export const authStorage = {
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(APP_CONFIG.tokenStorageKey, token);
    } catch (e) {
      console.error('Failed to save token to storage', e);
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(APP_CONFIG.tokenStorageKey);
    } catch (e) {
      console.error('Failed to get token from storage', e);
      return null;
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(APP_CONFIG.tokenStorageKey);
    } catch (e) {
      console.error('Failed to remove token from storage', e);
    }
  },

  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem(APP_CONFIG.userStorageKey, JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save user data to storage', e);
    }
  },

  async getUserData() {
    try {
      const data = await AsyncStorage.getItem(APP_CONFIG.userStorageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get user data from storage', e);
      return null;
    }
  },

  async removeUserData() {
    try {
      await AsyncStorage.removeItem(APP_CONFIG.userStorageKey);
    } catch (e) {
      console.error('Failed to remove user data from storage', e);
    }
  },

  async getBaseUrl() {
    try {
      const customUrl = await AsyncStorage.getItem(APP_CONFIG.serverUrlKey);
      return customUrl || DEFAULT_API_URL;
    } catch (e) {
      return DEFAULT_API_URL;
    }
  },

  async setBaseUrl(url) {
    try {
      if (url) {
        await AsyncStorage.setItem(APP_CONFIG.serverUrlKey, url.trim());
      } else {
        await AsyncStorage.removeItem(APP_CONFIG.serverUrlKey);
      }
    } catch (e) {
      console.error('Failed to set base URL', e);
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        APP_CONFIG.tokenStorageKey,
        APP_CONFIG.userStorageKey,
      ]);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  },
};

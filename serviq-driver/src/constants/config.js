import { Platform } from 'react-native';

// Default backend API URL
// In Android emulator: 10.0.2.2 points to host localhost
// On physical devices / LAN: host machine IP (192.168.29.158) or 10.0.2.2
export const DEFAULT_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

export const APP_CONFIG = {
  appName: 'SERVIQ Driver',
  version: '1.0.0',
  apiTimeout: 15000,
  tokenStorageKey: '@serviq_auth_token',
  userStorageKey: '@serviq_user_data',
  serverUrlKey: '@serviq_custom_api_url',
};

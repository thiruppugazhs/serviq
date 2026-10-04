import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { authStorage } from '../../services/authStorage';
import { DEFAULT_API_URL } from '../../constants/config';

export const LoginScreen = () => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('driver@serviq.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Server URL settings modal for development / testing
  const [serverUrlModalVisible, setServerUrlModalVisible] = useState(false);
  const [serverUrl, setServerUrl] = useState(DEFAULT_API_URL);

  useEffect(() => {
    authStorage.getBaseUrl().then((url) => {
      if (url) setServerUrl(url);
    });
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
    } catch (err) {
      console.warn('Login failed:', err.message);
      setErrorMessage(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveServerUrl = async () => {
    if (serverUrl.trim()) {
      await authStorage.setBaseUrl(serverUrl.trim());
      setServerUrlModalVisible(false);
      Alert.alert('Server URL Updated', `Connecting to: ${serverUrl.trim()}`);
    }
  };

  const fillDemoCredentials = () => {
    setIdentifier('driver@serviq.com');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Logo & Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🚛</Text>
          </View>
          <Text style={styles.brandTitle}>SERVIQ</Text>
          <Text style={styles.brandSubtitle}>DRIVER FLEET ACCESS</Text>
          <Text style={styles.welcomeText}>
            Sign in to manage your assigned vehicle, log trips, and report issues.
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.formCard}>
          <Input
            label="Email or Phone Number"
            placeholder="driver@serviq.com or +91..."
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (errorMessage) setErrorMessage('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage('');
            }}
            secureTextEntry
            icon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <Button
            title="LOG IN"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            size="large"
            style={styles.loginButton}
          />

          {/* Quick Demo Helper */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={fillDemoCredentials}
          >
            <Text style={styles.demoButtonText}>
              Use Demo Credentials (driver@serviq.com)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer info & Server Config Toggle */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Assigned driver access only. Fleet managers and admins must use the SERVIQ Web Console.
          </Text>

          <TouchableOpacity
            style={styles.serverSettingsLink}
            onPress={() => setServerUrlModalVisible(true)}
          >
            <Text style={styles.serverSettingsText}>
              ⚙️ Server: {serverUrl}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Server URL Config Modal */}
      <Modal
        visible={serverUrlModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setServerUrlModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configure API Server</Text>
            <Text style={styles.modalDescription}>
              Set the backend API host URL. On Android Emulator, use http://10.0.2.2:5000. On a physical device, use your host PC's Wi-Fi IP.
            </Text>

            <Input
              label="Backend Server URL"
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="http://10.0.2.2:5000"
              autoCapitalize="none"
            />

            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={() => setServerUrlModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Save & Connect"
                variant="primary"
                size="medium"
                onPress={handleSaveServerUrl}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 34,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 2,
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 12,
  },
  demoButton: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  serverSettingsLink: {
    marginTop: 16,
    padding: 6,
  },
  serverSettingsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 10,
    minWidth: 100,
  },
});

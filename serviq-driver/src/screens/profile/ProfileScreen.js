import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { authStorage } from '../../services/authStorage';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout, refreshProfile } = useAuth();

  const [driver, setDriver] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Edit profile state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const hostUrl = await authStorage.getBaseUrl();
      setBaseUrl(hostUrl);

      const res = await api.getDriverProfile();
      if (res.success && res.driver) {
        setDriver(res.driver);
      }
    } catch (err) {
      console.warn('Profile fetch error:', err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProfile();
  };

  const handleOpenEdit = () => {
    setEditPhone(driver?.user?.phone || user?.phone || '');
    setEditAddress(driver?.user?.address || user?.address || '');
    setEmergencyName(driver?.emergencyContact?.name || '');
    setEmergencyPhone(driver?.emergencyContact?.phone || '');
    setEmergencyRelationship(driver?.emergencyContact?.relationship || '');
    setSaveError('');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setSaveError('');
    setIsSaving(true);
    try {
      const payload = {
        phone: editPhone.trim(),
        address: editAddress.trim(),
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relationship: emergencyRelationship.trim(),
        },
      };

      const res = await api.updateDriverProfile(payload);
      if (res.success) {
        setDriver(res.driver);
        await refreshProfile();
        setIsEditModalVisible(false);
        Alert.alert('Profile Updated', 'Your profile details have been saved.');
      } else {
        throw new Error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        const formData = new FormData();
        formData.append('profilePhoto', {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.fileName || 'profile.jpg',
        });

        setIsLoading(true);
        const res = await api.updateDriverProfile(formData);
        if (res.success) {
          setDriver(res.driver);
          Alert.alert('Photo Updated', 'Your driver profile picture was updated.');
        }
      }
    } catch (err) {
      console.warn('Photo upload failed:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutPrompt = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of SERVIQ Driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Loading driver profile..." />;
  }

  const driverUser = driver?.user || user;
  const profilePhotoUri = driver?.profilePhoto
    ? driver.profilePhoto.startsWith('http')
      ? driver.profilePhoto
      : `${baseUrl}${driver.profilePhoto}`
    : null;

  return (
    <View style={styles.container}>
      <Header
        title="Driver Profile"
        subtitle={driver?.driverId || 'Fleet Driver'}
        rightAction={
          <Button
            title="Edit"
            size="small"
            variant="outline"
            onPress={handleOpenEdit}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Profile Card Header */}
        <Card style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              {profilePhotoUri ? (
                <Image source={{ uri: profilePhotoUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {(driverUser?.name || 'D').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Button
                title="📷"
                size="small"
                variant="secondary"
                onPress={handleUploadPhoto}
                style={styles.cameraIconBtn}
              />
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.driverName}>{driverUser?.name || 'Driver'}</Text>
              <View style={styles.driverIdPill}>
                <Text style={styles.driverIdText}>
                  ID: {driver?.driverId || 'DRV-1001'}
                </Text>
              </View>
              <Text style={styles.roleTag}>
                ● Authorized Driver • {driver?.employmentStatus?.replace('_', ' ')?.toUpperCase() || 'FULL TIME'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Section: Contact & Personal Details */}
        <Text style={styles.sectionTitle}>CONTACT & ADDRESS</Text>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{driverUser?.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>
              {driverUser?.phone || 'Not provided'}
            </Text>
          </View>

          <View style={styles.infoRowLast}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>
              {driverUser?.address || 'Guindy, Chennai'}
            </Text>
          </View>
        </Card>

        {/* Section: Driving Licence & Compliance */}
        <Text style={styles.sectionTitle}>LICENCE & COMPLIANCE (READ ONLY)</Text>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Licence Number</Text>
            <Text style={[styles.infoValue, { fontWeight: '800' }]}>
              {driver?.drivingLicenceNumber || 'TN01 2020 0004567'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Licence Expiry</Text>
            <Text style={styles.infoValue}>
              {formatDate(driver?.licenceExpiry || '2028-12-31')}
            </Text>
          </View>

          <View style={styles.infoRowLast}>
            <Text style={styles.infoLabel}>Assigned Vehicle</Text>
            <Text style={[styles.infoValue, { color: COLORS.primary, fontWeight: '800' }]}>
              {driver?.assignedVehicle?.vehicleNumber || 'TN 01 AB 1234'}
            </Text>
          </View>
        </Card>

        {/* Section: Emergency Contact */}
        <Text style={styles.sectionTitle}>EMERGENCY CONTACT</Text>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Name</Text>
            <Text style={styles.infoValue}>
              {driver?.emergencyContact?.name || 'Sunita Kumar'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>
              {driver?.emergencyContact?.phone || '+91 98765 43211'}
            </Text>
          </View>

          <View style={styles.infoRowLast}>
            <Text style={styles.infoLabel}>Relationship</Text>
            <Text style={styles.infoValue}>
              {driver?.emergencyContact?.relationship || 'Spouse'}
            </Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="LOG OUT"
          variant="outline"
          size="large"
          onPress={handleLogoutPrompt}
          style={styles.logoutButton}
          textStyle={{ color: COLORS.danger }}
        />

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            SERVIQ Mobile Driver v1.0.0 • Connected to MERN Fleet Engine
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Driver Information</Text>
            <Text style={styles.modalSubtitle}>
              Update your contact and emergency contact details
            </Text>

            {saveError ? (
              <Text style={styles.modalError}>{saveError}</Text>
            ) : null}

            <ScrollView style={{ maxHeight: 380 }}>
              <Input
                label="Phone Number"
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="+91..."
                keyboardType="phone-pad"
              />

              <Input
                label="Address"
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder="Current residential address"
                multiline
              />

              <Text style={styles.modalSubHeader}>Emergency Contact</Text>

              <Input
                label="Emergency Contact Name"
                value={emergencyName}
                onChangeText={setEmergencyName}
                placeholder="Name"
              />

              <Input
                label="Emergency Phone"
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />

              <Input
                label="Relationship"
                value={emergencyRelationship}
                onChangeText={setEmergencyRelationship}
                placeholder="e.g. Spouse / Brother / Parent"
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={() => setIsEditModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Save Changes"
                variant="primary"
                size="medium"
                loading={isSaving}
                onPress={handleSaveProfile}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  profileHeaderCard: {
    padding: 20,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cameraIconBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    minHeight: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  headerInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  driverIdPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginVertical: 4,
  },
  driverIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  roleTag: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  infoCard: {
    padding: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    maxWidth: 220,
    textAlign: 'right',
  },
  logoutButton: {
    marginTop: 20,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  footerNote: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  modalSubHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 14,
    marginBottom: 6,
  },
  modalError: {
    fontSize: 12,
    color: COLORS.danger,
    marginBottom: 8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
});

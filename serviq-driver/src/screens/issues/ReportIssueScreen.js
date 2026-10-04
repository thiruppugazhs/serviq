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
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingScreen } from '../../components/LoadingScreen';
import { api } from '../../services/api';

const CATEGORIES = [
  'Engine',
  'Brakes',
  'Tyres',
  'Electrical',
  'Battery',
  'AC',
  'Lights',
  'Suspension',
  'Transmission',
  'Other',
];

const SEVERITIES = [
  { id: 'low', label: 'Low', color: COLORS.success },
  { id: 'medium', label: 'Medium', color: COLORS.warning },
  { id: 'high', label: 'High', color: '#EA580C' },
  { id: 'critical', label: 'Critical', color: COLORS.danger },
];

export const ReportIssueScreen = ({ navigation }) => {
  const [assignedVehicle, setAssignedVehicle] = useState(null);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);

  // Form State
  const [category, setCategory] = useState('Engine');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const res = await api.getAssignedVehicle();
        if (res.success && res.vehicle) {
          setAssignedVehicle(res.vehicle);
        }
      } catch (err) {
        console.warn('Failed to load vehicle:', err.message);
      } finally {
        setIsLoadingVehicle(false);
      }
    };
    loadVehicle();
  }, []);

  const handlePickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 3,
      });

      if (result.assets && result.assets.length > 0) {
        setPhotos((prev) => [...prev, ...result.assets].slice(0, 5));
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const handleCaptureCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (result.assets && result.assets.length > 0) {
        setPhotos((prev) => [...prev, ...result.assets].slice(0, 5));
      }
    } catch (e) {
      console.warn('Camera error:', e);
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter an issue title.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a description of the problem.');
      return;
    }

    if (!assignedVehicle) {
      setFormError('No assigned vehicle found to report issue against.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Map category name to backend enum ('Tyres' -> 'Tire', 'AC' -> 'Air Conditioning', etc.)
      let mappedCategory = category;
      if (category === 'Tyres') mappedCategory = 'Tire';
      if (category === 'AC') mappedCategory = 'Air Conditioning';
      if (category === 'Battery') mappedCategory = 'Electrical';
      if (category === 'Lights') mappedCategory = 'Other';

      // Build multipart FormData
      const formData = new FormData();
      formData.append('vehicleId', assignedVehicle._id);
      formData.append('issueType', mappedCategory);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('priority', severity);
      formData.append('odometerAtIncident', String(assignedVehicle.odometer || 0));

      // Append photo assets
      photos.forEach((photo, idx) => {
        formData.append('photos', {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.fileName || `issue_photo_${idx + 1}.jpg`,
        });
      });

      const res = await api.reportIssue(formData);

      if (res.success) {
        Alert.alert(
          'Issue Reported Successfully',
          `Your breakdown ticket for ${assignedVehicle.vehicleNumber} has been dispatched to the Fleet Operations team.`,
          [
            {
              text: 'Track Issue',
              onPress: () => {
                navigation.replace('RepairDetail', {
                  repairId: res.repair?._id,
                });
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        throw new Error(res.message || 'Failed to submit issue');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit issue report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingVehicle) {
    return <LoadingScreen message="Initializing issue report form..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Report Vehicle Issue"
        subtitle="Submit Breakdown or Defect"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Vehicle Auto-Selection Card */}
        <Card style={styles.vehicleCard}>
          <Text style={styles.vehicleLabel}>ASSIGNED VEHICLE (AUTO-SELECTED)</Text>
          <Text style={styles.vehiclePlate}>
            {assignedVehicle ? assignedVehicle.vehicleNumber : 'No Vehicle Assigned'}
          </Text>
          <Text style={styles.vehicleSub}>
            {assignedVehicle
              ? `${assignedVehicle.manufacturer} ${assignedVehicle.model} • Current Odo: ${assignedVehicle.odometer?.toLocaleString()} km`
              : 'Please contact Fleet Manager for vehicle assignment.'}
          </Text>
        </Card>

        {formError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        ) : null}

        {/* Category Picker */}
        <Text style={styles.fieldLabel}>ISSUE CATEGORY *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Severity Picker */}
        <Text style={styles.fieldLabel}>SEVERITY LEVEL *</Text>
        <View style={styles.severityRow}>
          {SEVERITIES.map((sev) => {
            const isSelected = severity === sev.id;
            return (
              <TouchableOpacity
                key={sev.id}
                style={[
                  styles.severityPill,
                  isSelected && {
                    backgroundColor: sev.color,
                    borderColor: sev.color,
                  },
                ]}
                onPress={() => setSeverity(sev.id)}
              >
                <Text
                  style={[
                    styles.severityText,
                    isSelected && { color: COLORS.textInverse },
                  ]}
                >
                  {sev.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Title & Description Inputs */}
        <Input
          label="Issue Title *"
          placeholder="e.g. Engine Noise / Vibration at idle"
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            setFormError('');
          }}
        />

        <Input
          label="Detailed Description *"
          placeholder="Describe what occurred, any unusual noises, smells, or dashboard warning lights..."
          value={description}
          onChangeText={(t) => {
            setDescription(t);
            setFormError('');
          }}
          multiline
          numberOfLines={4}
        />

        {/* Photo Upload Section */}
        <Text style={styles.fieldLabel}>ATTACH PHOTOS (MAX 5)</Text>

        <View style={styles.photoActionRow}>
          <TouchableOpacity
            style={styles.photoActionButton}
            onPress={handleCaptureCamera}
          >
            <Text style={styles.photoActionIcon}>📷</Text>
            <Text style={styles.photoActionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.photoActionButton}
            onPress={handlePickFromGallery}
          >
            <Text style={styles.photoActionIcon}>🖼️</Text>
            <Text style={styles.photoActionText}>From Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Previews */}
        {photos.length > 0 && (
          <ScrollView horizontal style={styles.photoPreviewScroll}>
            {photos.map((p, idx) => (
              <View key={idx} style={styles.photoThumbContainer}>
                <Image source={{ uri: p.uri }} style={styles.photoThumb} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => handleRemovePhoto(idx)}
                >
                  <Text style={styles.removePhotoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Submit Button */}
        <Button
          title="SUBMIT ISSUE"
          variant="danger"
          size="large"
          loading={isSubmitting}
          disabled={!assignedVehicle}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 16,
  },
  vehicleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  vehicleSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
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
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginTop: 12,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingBottom: 6,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  categoryTextSelected: {
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  severityPill: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  photoActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  photoActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  photoActionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  photoPreviewScroll: {
    marginBottom: 14,
  },
  photoThumbContainer: {
    position: 'relative',
    marginRight: 10,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.borderLight,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.danger,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
  },
});

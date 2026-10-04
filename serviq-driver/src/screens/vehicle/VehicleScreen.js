import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ErrorView } from '../../components/ErrorView';
import { EmptyState } from '../../components/EmptyState';
import { api } from '../../services/api';
import { formatKm, formatDate } from '../../utils/helpers';

export const VehicleScreen = ({ navigation }) => {
  const [vehicle, setVehicle] = useState(null);
  const [assigned, setAssigned] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchVehicleDetails = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getAssignedVehicle();
      if (res.success) {
        setAssigned(res.assigned);
        setVehicle(res.vehicle);
      }
    } catch (err) {
      console.warn('Vehicle details error:', err.message);
      setErrorMessage(err.message || 'Unable to load vehicle details.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchVehicleDetails();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading vehicle specifications..." />;
  }

  if (errorMessage && !vehicle) {
    return (
      <View style={styles.container}>
        <Header title="My Vehicle" />
        <ErrorView message={errorMessage} onRetry={fetchVehicleDetails} />
      </View>
    );
  }

  if (!assigned || !vehicle) {
    return (
      <View style={styles.container}>
        <Header title="My Vehicle" />
        <EmptyState
          icon="🚛"
          title="No Vehicle Assigned"
          message="You currently do not have any vehicle assigned to your profile. Contact your fleet manager for vehicle allocation."
          actionTitle="Check Again"
          onAction={fetchVehicleDetails}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Vehicle" />

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
        {/* Registration & Model Banner */}
        <Card style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <Text style={styles.typeLabel}>{vehicle.vehicleType?.toUpperCase() || 'TRUCK'}</Text>
            <StatusBadge status={vehicle.status || 'Active'} />
          </View>
          <Text style={styles.regNumber}>{vehicle.vehicleNumber}</Text>
          <Text style={styles.modelSubtitle}>
            {vehicle.manufacturer} {vehicle.model}
          </Text>
          <View style={styles.readOnlyNotice}>
            <Text style={styles.readOnlyText}>🔒 Assigned to you • Managed by Fleet Operations</Text>
          </View>
        </Card>

        {/* Vehicle Sections / Feature Shortcuts */}
        <Text style={styles.sectionHeader}>VEHICLE HUBS & DIAGNOSTICS</Text>

        <View style={styles.navGrid}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('VehicleHealth')}
          >
            <View style={[styles.navIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.navIcon}>🩺</Text>
            </View>
            <Text style={styles.navTitle}>Vehicle Health</Text>
            <Text style={styles.navSub}>Subsystems & diagnostics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Odometer')}
          >
            <View style={[styles.navIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.navIcon}>⏱️</Text>
            </View>
            <Text style={styles.navTitle}>Odometer</Text>
            <Text style={styles.navSub}>{formatKm(vehicle.odometer)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Maintenance')}
          >
            <View style={[styles.navIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.navIcon}>🔧</Text>
            </View>
            <Text style={styles.navTitle}>Maintenance</Text>
            <Text style={styles.navSub}>Upcoming schedules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('ServiceHistory')}
          >
            <View style={[styles.navIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Text style={styles.navIcon}>📜</Text>
            </View>
            <Text style={styles.navTitle}>Service History</Text>
            <Text style={styles.navSub}>Past services & repairs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Documents')}
          >
            <View style={[styles.navIconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Text style={styles.navIcon}>📁</Text>
            </View>
            <Text style={styles.navTitle}>Documents</Text>
            <Text style={styles.navSub}>RC, Insurance, PUC</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('IssuesTab')}
          >
            <View style={[styles.navIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Text style={styles.navIcon}>⚠️</Text>
            </View>
            <Text style={styles.navTitle}>Repairs & Issues</Text>
            <Text style={styles.navSub}>Track open tickets</Text>
          </TouchableOpacity>
        </View>

        {/* Detailed Specifications */}
        <Text style={styles.sectionHeader}>SPECIFICATIONS & COMPLIANCE</Text>

        <Card style={styles.specsCard}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Registration Number</Text>
            <Text style={styles.specValue}>{vehicle.vehicleNumber}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Manufacturer</Text>
            <Text style={styles.specValue}>{vehicle.manufacturer}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Model</Text>
            <Text style={styles.specValue}>{vehicle.model}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Vehicle Type</Text>
            <Text style={styles.specValue}>{vehicle.vehicleType}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Manufacturing Year</Text>
            <Text style={styles.specValue}>{vehicle.year || '2023'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Fuel Type</Text>
            <Text style={styles.specValue}>{vehicle.fuelType || 'Diesel'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Current Odometer</Text>
            <Text style={[styles.specValue, { fontWeight: '800', color: COLORS.primary }]}>
              {formatKm(vehicle.odometer)}
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Vehicle Status</Text>
            <Text style={[styles.specValue, { textTransform: 'capitalize' }]}>
              {vehicle.status?.replace('_', ' ')}
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>RC Number</Text>
            <Text style={styles.specValue}>{vehicle.rcNumber || 'RC-TN01-AB1234-2023'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Chassis / VIN</Text>
            <Text style={styles.specValue}>{vehicle.vin || 'MB1A2B3C4D5E6F7G8'}</Text>
          </View>
          <View style={styles.specRowLast}>
            <Text style={styles.specLabel}>Assigned Date</Text>
            <Text style={styles.specValue}>
              {formatDate(vehicle.createdAt || new Date())}
            </Text>
          </View>
        </Card>
      </ScrollView>
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
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  regNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 1,
  },
  modelSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  readOnlyNotice: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  readOnlyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 12,
  },
  navCard: {
    width: '50%',
    padding: 6,
  },
  navIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  navIcon: {
    fontSize: 22,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  navSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  specsCard: {
    padding: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  specRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  specLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});

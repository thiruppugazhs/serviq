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
import { Button } from '../../components/Button';
import { ErrorView } from '../../components/ErrorView';
import { LoadingScreen } from '../../components/LoadingScreen';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { formatKm, formatDate, getGreeting } from '../../utils/helpers';

export const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { notifications, fetchNotifications } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [vehicleData, setVehicleData] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const loadDashboardData = useCallback(async () => {
    setHasError(false);
    setErrorMessage('');
    try {
      const [vehRes, healthRes] = await Promise.all([
        api.getAssignedVehicle(),
        api.getVehicleHealth().catch(() => ({ success: false })),
        fetchNotifications(),
      ]);

      if (vehRes.success) {
        setVehicleData(vehRes);
      }
      if (healthRes.success) {
        setHealthData(healthRes);
      }
    } catch (err) {
      console.warn('Dashboard load error:', err.message);
      setHasError(true);
      setErrorMessage(err.message || 'Unable to load vehicle information.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const driverName = user?.firstName || user?.name || 'Driver';
  const greeting = getGreeting();

  if (isLoading) {
    return <LoadingScreen message="Loading dashboard & vehicle telemetry..." />;
  }

  if (hasError && !vehicleData) {
    return (
      <View style={styles.container}>
        <Header
          title="SERVIQ"
          subtitle={`${greeting}, ${driverName}`}
          showNotifications
          navigation={navigation}
        />
        <ErrorView message={errorMessage} onRetry={loadDashboardData} />
      </View>
    );
  }

  const assigned = vehicleData?.assigned;
  const vehicle = vehicleData?.vehicle;
  const nextMaintenance = vehicleData?.nextMaintenance;
  const activeRepair = vehicleData?.activeRepair;

  return (
    <View style={styles.container}>
      <Header
        title="SERVIQ"
        subtitle={`${greeting}, ${driverName}`}
        showNotifications
        navigation={navigation}
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
        {/* Unassigned Vehicle Fallback */}
        {!assigned || !vehicle ? (
          <EmptyState
            icon="🚛"
            title="No Assigned Vehicle"
            message="Your organization has not yet assigned a vehicle to your driver profile. Please contact your Fleet Manager."
            actionTitle="Refresh Telemetry"
            onAction={loadDashboardData}
          />
        ) : (
          <>
            {/* Main Assigned Vehicle Hero Card */}
            <Card
              style={styles.heroVehicleCard}
              onPress={() => navigation.navigate('VehicleTab')}
            >
              <View style={styles.vehicleHeaderRow}>
                <View style={styles.vehicleTagRow}>
                  <Text style={styles.vehicleTag}>ASSIGNED VEHICLE</Text>
                  <StatusBadge status={vehicle.status || 'Active'} size="small" />
                </View>
                <Text style={styles.chevron}>→</Text>
              </View>

              <Text style={styles.plateNumber}>{vehicle.vehicleNumber}</Text>
              <Text style={styles.vehicleModel}>
                {vehicle.manufacturer} {vehicle.model}
                {vehicle.year ? ` (${vehicle.year})` : ''} • {vehicle.fuelType || 'Diesel'}
              </Text>

              <View style={styles.divider} />

              {/* 2x2 Telemetry Metric Grid */}
              <View style={styles.metricGrid}>
                {/* 1. Current Odometer */}
                <TouchableOpacity
                  style={styles.metricItem}
                  onPress={() => navigation.navigate('Odometer')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.metricLabel}>CURRENT ODOMETER</Text>
                  <Text style={styles.metricValue}>
                    {formatKm(vehicle.odometer)}
                  </Text>
                  <Text style={styles.metricLink}>Update reading →</Text>
                </TouchableOpacity>

                {/* 2. Vehicle Health */}
                <TouchableOpacity
                  style={styles.metricItem}
                  onPress={() => navigation.navigate('VehicleHealth')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.metricLabel}>VEHICLE HEALTH</Text>
                  <View style={styles.healthRow}>
                    <Text
                      style={[
                        styles.healthIcon,
                        {
                          color:
                            healthData?.overallFlag === 'good'
                              ? COLORS.success
                              : healthData?.overallFlag === 'critical'
                              ? COLORS.danger
                              : COLORS.warning,
                        },
                      ]}
                    >
                      {healthData?.overallFlag === 'good' ? '✓' : '⚠️'}
                    </Text>
                    <Text
                      style={[
                        styles.metricValue,
                        {
                          color:
                            healthData?.overallFlag === 'good'
                              ? COLORS.success
                              : healthData?.overallFlag === 'critical'
                              ? COLORS.danger
                              : COLORS.warning,
                        },
                      ]}
                    >
                      {healthData?.overallHealth || 'Good'}
                    </Text>
                  </View>
                  <Text style={styles.metricLink}>Diagnostics →</Text>
                </TouchableOpacity>

                {/* 3. Next Service */}
                <TouchableOpacity
                  style={styles.metricItem}
                  onPress={() => navigation.navigate('Maintenance')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.metricLabel}>NEXT SERVICE</Text>
                  <Text style={styles.metricValue}>
                    {nextMaintenance?.nextDueDate
                      ? formatDate(nextMaintenance.nextDueDate, { short: true })
                      : '12 Oct 2026'}
                  </Text>
                  <Text style={styles.metricSubtext}>
                    {nextMaintenance?.serviceType || 'Oil Change'}
                  </Text>
                </TouchableOpacity>

                {/* 4. Active Repair */}
                <TouchableOpacity
                  style={styles.metricItem}
                  onPress={() => {
                    if (activeRepair) {
                      navigation.navigate('RepairDetail', { repairId: activeRepair._id });
                    } else {
                      navigation.navigate('IssuesTab');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.metricLabel}>ACTIVE REPAIR</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      activeRepair && { color: COLORS.warning },
                    ]}
                  >
                    {activeRepair ? `${activeRepair.issueType} Issue` : 'None'}
                  </Text>
                  <Text style={styles.metricSubtext}>
                    {activeRepair ? activeRepair.status?.replace('_', ' ')?.toUpperCase() : 'All systems clear'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Quick Actions Row */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            </View>

            <View style={styles.actionButtonRow}>
              <Button
                title="Report Issue"
                variant="danger"
                size="medium"
                icon={<Text style={styles.btnIcon}>⚠️</Text>}
                onPress={() => navigation.navigate('ReportIssue')}
                style={styles.actionButton}
              />
              <Button
                title="Update Odometer"
                variant="primary"
                size="medium"
                icon={<Text style={styles.btnIcon}>⏱️</Text>}
                onPress={() => navigation.navigate('Odometer')}
                style={styles.actionButton}
              />
            </View>

            {/* Active Repair Banner (If any) */}
            {activeRepair && (
              <Card
                style={styles.activeRepairCard}
                onPress={() =>
                  navigation.navigate('RepairDetail', { repairId: activeRepair._id })
                }
              >
                <View style={styles.activeRepairHeader}>
                  <View style={styles.repairBadgeRow}>
                    <Text style={styles.activeRepairLabel}>ACTIVE REPAIR TICKET</Text>
                    <StatusBadge status={activeRepair.status} size="small" />
                  </View>
                  <Text style={styles.chevron}>→</Text>
                </View>
                <Text style={styles.activeRepairTitle}>
                  {activeRepair.issueType}: {activeRepair.description}
                </Text>
                <Text style={styles.activeRepairMeta}>
                  Priority: {activeRepair.priority?.toUpperCase()} • Tap to track repair progress
                </Text>
              </Card>
            )}

            {/* Upcoming Maintenance Preview */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>UPCOMING MAINTENANCE</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Maintenance')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <Card
              onPress={() => navigation.navigate('Maintenance')}
              style={styles.maintenancePreviewCard}
            >
              <View style={styles.maintenanceRow}>
                <View style={styles.maintenanceIconBox}>
                  <Text style={styles.maintIcon}>🔧</Text>
                </View>
                <View style={styles.maintenanceInfo}>
                  <Text style={styles.maintTitle}>
                    {nextMaintenance?.serviceType || 'Oil Change & Filter Service'}
                  </Text>
                  <Text style={styles.maintSub}>
                    Due: {nextMaintenance?.nextDueDate ? formatDate(nextMaintenance.nextDueDate) : '12 Oct 2026'}
                    {nextMaintenance?.nextDueOdometer ? ` (${formatKm(nextMaintenance.nextDueOdometer)})` : ''}
                  </Text>
                </View>
                <StatusBadge
                  status={nextMaintenance?.status || 'good'}
                  label={nextMaintenance?.status === 'good' ? 'Upcoming' : nextMaintenance?.status}
                  size="small"
                />
              </View>
            </Card>

            {/* Recent Notifications Preview */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>RECENT NOTIFICATIONS</Text>
              <TouchableOpacity onPress={() => navigation.navigate('NotificationsTab')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {notifications && notifications.length > 0 ? (
              <Card
                onPress={() => navigation.navigate('NotificationsTab')}
                style={styles.notifPreviewCard}
              >
                <View style={styles.notifRow}>
                  <Text style={styles.notifIcon}>🔔</Text>
                  <View style={styles.notifInfo}>
                    <Text style={styles.notifTitle} numberOfLines={1}>
                      {notifications[0].title}
                    </Text>
                    <Text style={styles.notifMessage} numberOfLines={2}>
                      {notifications[0].message}
                    </Text>
                    <Text style={styles.notifTime}>
                      {formatDate(notifications[0].createdAt)}
                    </Text>
                  </View>
                </View>
              </Card>
            ) : (
              <Card style={styles.notifPreviewCard}>
                <Text style={styles.emptyNotifText}>No recent alerts</Text>
              </Card>
            )}
          </>
        )}
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
  heroVehicleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginRight: 10,
  },
  chevron: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  plateNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 1,
    marginVertical: 2,
  },
  vehicleModel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 14,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricItem: {
    width: '50%',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricLink: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
  metricSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIcon: {
    fontSize: 16,
    fontWeight: '900',
    marginRight: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  actionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  btnIcon: {
    fontSize: 16,
  },
  activeRepairCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
    marginVertical: 8,
  },
  activeRepairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  repairBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeRepairLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#92400E',
    marginRight: 8,
  },
  activeRepairTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 4,
  },
  activeRepairMeta: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '500',
  },
  maintenancePreviewCard: {
    marginVertical: 4,
  },
  maintenanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  maintIcon: {
    fontSize: 20,
  },
  maintenanceInfo: {
    flex: 1,
  },
  maintTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  maintSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifPreviewCard: {
    marginVertical: 4,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notifIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notifInfo: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notifMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  emptyNotifText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 8,
  },
});

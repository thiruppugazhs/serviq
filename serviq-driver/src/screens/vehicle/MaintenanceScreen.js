import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
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

export const MaintenanceScreen = ({ navigation }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMaintenance = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getVehicleMaintenance();
      if (res.success) {
        setMaintenanceRecords(res.all || res.maintenance || []);
      }
    } catch (err) {
      console.warn('Maintenance fetch error:', err.message);
      setErrorMessage(err.message || 'Unable to load maintenance schedules.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMaintenance();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading maintenance schedules..." />;
  }

  if (errorMessage && maintenanceRecords.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Maintenance" showBack onBack={() => navigation.goBack()} />
        <ErrorView message={errorMessage} onRetry={fetchMaintenance} />
      </View>
    );
  }

  const upcomingRecords = maintenanceRecords.filter((r) => r.status !== 'completed');
  const completedRecords = maintenanceRecords.filter((r) => r.status === 'completed');

  return (
    <View style={styles.container}>
      <Header
        title="Maintenance"
        subtitle="Preventive Schedules (View Only)"
        showBack
        onBack={() => navigation.goBack()}
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
        {/* Info notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            🔒 Maintenance schedules are coordinated by Fleet Operations and authorized service partners.
          </Text>
        </View>

        {/* Section: Upcoming Maintenance */}
        <Text style={styles.sectionTitle}>UPCOMING MAINTENANCE</Text>

        {upcomingRecords.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming maintenance scheduled at this time.</Text>
          </Card>
        ) : (
          upcomingRecords.map((item) => {
            const isOverdue = item.status === 'overdue';
            const isDueSoon = item.status === 'due_soon';

            return (
              <Card
                key={item._id}
                style={[
                  styles.maintCard,
                  isOverdue && styles.overdueBorder,
                  isDueSoon && styles.dueSoonBorder,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.serviceTitle}>{item.serviceType}</Text>
                  <StatusBadge
                    status={item.status}
                    label={
                      item.status === 'good'
                        ? 'UPCOMING'
                        : item.status?.replace('_', ' ')?.toUpperCase()
                    }
                  />
                </View>

                <View style={styles.metaGrid}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>DUE DATE</Text>
                    <Text style={styles.metaValue}>
                      {item.nextDueDate ? formatDate(item.nextDueDate) : 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>DUE ODOMETER</Text>
                    <Text style={styles.metaValue}>
                      {item.nextDueOdometer ? formatKm(item.nextDueOdometer) : 'N/A'}
                    </Text>
                  </View>
                </View>

                {item.serviceCenter ? (
                  <View style={styles.centerRow}>
                    <Text style={styles.centerLabel}>Service Center:</Text>
                    <Text style={styles.centerValue}>{item.serviceCenter}</Text>
                  </View>
                ) : null}

                {item.notes ? (
                  <Text style={styles.notesText}>{item.notes}</Text>
                ) : null}
              </Card>
            );
          })
        )}

        {/* Section: Completed Records */}
        {completedRecords.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              RECENTLY COMPLETED
            </Text>

            {completedRecords.map((item) => (
              <Card key={item._id} style={styles.completedCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.completedTitle}>{item.serviceType}</Text>
                  <StatusBadge status="completed" label="COMPLETED" size="small" />
                </View>
                <Text style={styles.completedSub}>
                  Completed on {formatDate(item.lastServiceDate)} at {formatKm(item.lastServiceOdometer)}
                </Text>
              </Card>
            ))}
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
  noticeBox: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noticeText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  maintCard: {
    padding: 18,
    marginVertical: 6,
  },
  overdueBorder: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  dueSoonBorder: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  centerLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  centerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  completedCard: {
    padding: 14,
    marginVertical: 4,
    opacity: 0.9,
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  completedSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

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
import { LoadingScreen } from '../../components/LoadingScreen';
import { ErrorView } from '../../components/ErrorView';
import { api } from '../../services/api';

export const VehicleHealthScreen = ({ navigation }) => {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchHealthData = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getVehicleHealth();
      if (res.success) {
        setHealthData(res);
      } else {
        throw new Error(res.message || 'Unable to retrieve vehicle diagnostics');
      }
    } catch (err) {
      console.warn('Vehicle health fetch error:', err.message);
      setErrorMessage(err.message || 'Unable to load vehicle health.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchHealthData();
  };

  if (isLoading) {
    return <LoadingScreen message="Running vehicle telemetry diagnostics..." />;
  }

  if (errorMessage && !healthData) {
    return (
      <View style={styles.container}>
        <Header title="Vehicle Health" showBack onBack={() => navigation.goBack()} />
        <ErrorView message={errorMessage} onRetry={fetchHealthData} />
      </View>
    );
  }

  const overallFlag = healthData?.overallFlag || 'good';
  const overallHealth = healthData?.overallHealth || 'Good';
  const components = healthData?.components || [];

  return (
    <View style={styles.container}>
      <Header
        title="Vehicle Health"
        subtitle={healthData?.vehicleNumber || 'Assigned Vehicle'}
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
        {/* Overall Status Banner */}
        <Card
          style={[
            styles.bannerCard,
            overallFlag === 'good' && styles.bannerGood,
            overallFlag === 'warning' && styles.bannerWarning,
            overallFlag === 'critical' && styles.bannerCritical,
          ]}
        >
          <View style={styles.bannerRow}>
            <View
              style={[
                styles.bannerIconCircle,
                overallFlag === 'good' && { backgroundColor: '#DCFCE7' },
                overallFlag === 'warning' && { backgroundColor: '#FEF3C7' },
                overallFlag === 'critical' && { backgroundColor: '#FEE2E2' },
              ]}
            >
              <Text style={styles.bannerIcon}>
                {overallFlag === 'good' ? '✓' : overallFlag === 'critical' ? '🚨' : '⚠️'}
              </Text>
            </View>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerSubtitle}>OVERALL FLEET STATUS</Text>
              <Text style={styles.bannerTitle}>{overallHealth}</Text>
              <Text style={styles.bannerDesc}>
                {overallFlag === 'good'
                  ? 'All vital systems are operating within normal parameters.'
                  : overallFlag === 'critical'
                  ? 'Immediate workshop inspection required before next trip.'
                  : 'Minor component issues noted. Please monitor closely.'}
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>SUBSYSTEM DIAGNOSTICS</Text>

        {/* Component Health Breakdown */}
        {components.map((item, index) => {
          const isGood = item.flag === 'good';
          const isWarning = item.flag === 'warning';
          const isCritical = item.flag === 'critical';

          let icon = '⚙️';
          if (item.name === 'Engine') icon = '🏎️';
          if (item.name === 'Brakes') icon = '🛑';
          if (item.name === 'Tyres') icon = '🛞';
          if (item.name === 'Battery') icon = '🔋';
          if (item.name === 'Suspension') icon = '🔩';
          if (item.name === 'Transmission') icon = '🔄';
          if (item.name === 'AC') icon = '❄️';
          if (item.name === 'Service') icon = '🔧';
          if (item.name === 'Documents') icon = '📄';

          return (
            <Card key={index} style={styles.componentCard}>
              <View style={styles.componentHeader}>
                <View style={styles.componentLeft}>
                  <Text style={styles.componentIcon}>{icon}</Text>
                  <View>
                    <Text style={styles.componentName}>{item.name}</Text>
                    <Text style={styles.componentDetail}>{item.detail}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    isGood && styles.statusPillGood,
                    isWarning && styles.statusPillWarning,
                    isCritical && styles.statusPillCritical,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isGood && { color: COLORS.success },
                      isWarning && { color: '#B45309' },
                      isCritical && { color: COLORS.danger },
                    ]}
                  >
                    {isGood ? '✓ ' : '⚠️ '}
                    {item.status}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            ℹ️ Health status is synchronized in real-time from fleet telemetry, workshop inspections, and scheduled maintenance records.
          </Text>
        </View>
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
  bannerCard: {
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
  },
  bannerGood: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  bannerWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  bannerCritical: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bannerIcon: {
    fontSize: 24,
    fontWeight: '900',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  bannerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  componentCard: {
    padding: 16,
    marginVertical: 4,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  componentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  componentName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  componentDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusPillGood: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statusPillWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  statusPillCritical: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  footerNoteText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

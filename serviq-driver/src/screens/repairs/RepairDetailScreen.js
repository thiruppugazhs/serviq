import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ErrorView } from '../../components/ErrorView';
import { api } from '../../services/api';
import { formatKm, formatDate, formatDateTime, formatCurrency } from '../../utils/helpers';
import { authStorage } from '../../services/authStorage';

export const RepairDetailScreen = ({ route, navigation }) => {
  const { repairId } = route.params || {};

  const [repair, setRepair] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRepairDetails = useCallback(async () => {
    if (!repairId) return;
    setErrorMessage('');
    try {
      const hostUrl = await authStorage.getBaseUrl();
      setBaseUrl(hostUrl);

      const res = await api.getRepairById(repairId);
      if (res.success && res.repair) {
        setRepair(res.repair);
        setTimeline(res.timeline || []);
      } else {
        throw new Error(res.message || 'Repair record not found');
      }
    } catch (err) {
      console.warn('Repair detail error:', err.message);
      setErrorMessage(err.message || 'Unable to load repair tracking.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [repairId]);

  useEffect(() => {
    fetchRepairDetails();
  }, [fetchRepairDetails]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRepairDetails();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading repair workflow & telemetry..." />;
  }

  if (errorMessage && !repair) {
    return (
      <View style={styles.container}>
        <Header title="Repair Tracking" showBack onBack={() => navigation.goBack()} />
        <ErrorView message={errorMessage} onRetry={fetchRepairDetails} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Repair Tracking"
        subtitle={`Ticket #${repair?._id?.slice(-6).toUpperCase()}`}
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
        {/* Ticket Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <Text style={styles.categoryBadge}>
              {repair?.issueType?.toUpperCase()}
            </Text>
            <StatusBadge status={repair?.status} />
          </View>

          <Text style={styles.titleText}>{repair?.description}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.vehicleInfo}>
              Vehicle: {repair?.vehicle?.vehicleNumber || 'Assigned Vehicle'}
            </Text>
            <Text style={styles.priorityText}>
              Priority: {repair?.priority?.toUpperCase()}
            </Text>
          </View>
        </Card>

        {/* Visual Repair Tracking Timeline */}
        <Text style={styles.sectionTitle}>PROGRESS TIMELINE</Text>

        <Card style={styles.timelineCard}>
          {timeline.map((step, idx) => {
            const isLast = idx === timeline.length - 1;
            const isDone = step.completed;
            const isCurrent = step.current;

            return (
              <View key={step.key} style={styles.stepContainer}>
                <View style={styles.timelineLeft}>
                  {/* Step indicator circle */}
                  <View
                    style={[
                      styles.indicatorCircle,
                      isDone && styles.indicatorDone,
                      isCurrent && styles.indicatorCurrent,
                      !isDone && !isCurrent && styles.indicatorPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.indicatorIcon,
                        isDone && { color: '#FFFFFF' },
                        isCurrent && { color: COLORS.primary },
                        !isDone && !isCurrent && { color: COLORS.textMuted },
                      ]}
                    >
                      {isDone ? '✓' : isCurrent ? '●' : '○'}
                    </Text>
                  </View>

                  {/* Vertical connecting line */}
                  {!isLast && (
                    <View
                      style={[
                        styles.connectorLine,
                        isDone && styles.connectorDone,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepLabel,
                      (isDone || isCurrent) && styles.stepLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {step.timestamp ? (
                    <Text style={styles.stepTime}>
                      {formatDateTime(step.timestamp)}
                    </Text>
                  ) : (
                    <Text style={styles.stepPendingText}>Pending fleet action</Text>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

        {/* Workshop & Resolution Details */}
        <Text style={styles.sectionTitle}>WORKSHOP & LOGISTICS</Text>

        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Facility</Text>
            <Text style={styles.detailValue}>
              {repair?.assignedWorkshop || 'SERVIQ Fleet Care Center'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Odometer at Incident</Text>
            <Text style={styles.detailValue}>
              {formatKm(repair?.odometerAtIncident)}
            </Text>
          </View>

          {repair?.cost ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Cost</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(repair.cost)}
              </Text>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reported By</Text>
            <Text style={styles.detailValue}>
              {repair?.reportedBy?.name || 'Driver'}
            </Text>
          </View>

          {repair?.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Technician Notes:</Text>
              <Text style={styles.notesContent}>{repair.notes}</Text>
            </View>
          ) : null}
        </Card>

        {/* Attached Photos */}
        {repair?.photos && repair.photos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PHOTO EVIDENCE</Text>
            <ScrollView horizontal style={styles.photoScroll}>
              {repair.photos.map((p, idx) => {
                const imgUri = p.startsWith('http') ? p : `${baseUrl}${p}`;
                return (
                  <View key={idx} style={styles.photoContainer}>
                    <Image source={{ uri: imgUri }} style={styles.photo} />
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}

        <View style={styles.readOnlyNote}>
          <Text style={styles.readOnlyText}>
            🔒 Driver View Only: Repair status changes are managed exclusively by the Fleet Operations team.
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
    paddingBottom: 36,
  },
  headerCard: {
    padding: 18,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.primaryLight,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  vehicleInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  timelineCard: {
    padding: 20,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  indicatorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDone: {
    backgroundColor: COLORS.success,
  },
  indicatorCurrent: {
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  indicatorPending: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  indicatorIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  connectorDone: {
    backgroundColor: COLORS.success,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 2,
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  stepLabelActive: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepPendingText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  detailsCard: {
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notesBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  notesContent: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  photoScroll: {
    marginBottom: 16,
  },
  photoContainer: {
    marginRight: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: COLORS.borderLight,
  },
  readOnlyNote: {
    padding: 12,
    alignItems: 'center',
  },
  readOnlyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

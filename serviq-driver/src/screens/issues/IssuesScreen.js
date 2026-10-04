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
import { LoadingScreen } from '../../components/LoadingScreen';
import { ErrorView } from '../../components/ErrorView';
import { EmptyState } from '../../components/EmptyState';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export const IssuesScreen = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchIssues = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getIssues();
      if (res.success) {
        setIssues(res.issues || []);
      }
    } catch (err) {
      console.warn('Issues fetch error:', err.message);
      setErrorMessage(err.message || 'Unable to load reported issues.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchIssues();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading issues & repair tickets..." />;
  }

  if (errorMessage && issues.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Reported Issues" />
        <ErrorView message={errorMessage} onRetry={fetchIssues} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Reported Issues"
        subtitle="Breakdowns & Repair Requests"
        rightAction={
          <Button
            title="+ Report"
            size="small"
            variant="danger"
            onPress={() => navigation.navigate('ReportIssue')}
            style={styles.headerBtn}
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
        {/* Floating action banner */}
        <Card style={styles.ctaCard}>
          <View style={styles.ctaRow}>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Vehicle Malfunction?</Text>
              <Text style={styles.ctaSub}>
                Instantly submit an issue ticket with photo evidence to Fleet Command.
              </Text>
            </View>
            <Button
              title="Report Issue"
              variant="danger"
              size="medium"
              icon={<Text style={styles.ctaIcon}>⚠️</Text>}
              onPress={() => navigation.navigate('ReportIssue')}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>ISSUE HISTORY ({issues.length})</Text>

        {issues.length === 0 ? (
          <EmptyState
            icon="✅"
            title="No Reported Issues"
            message="No maintenance or mechanical issues reported for your assigned vehicle. Everything is running smoothly."
            actionTitle="Report an Issue"
            onAction={() => navigation.navigate('ReportIssue')}
          />
        ) : (
          issues.map((issue) => {
            const isCritical = issue.priority === 'critical';
            const isHigh = issue.priority === 'high';

            return (
              <Card
                key={issue._id}
                style={[
                  styles.issueCard,
                  isCritical && styles.criticalBorder,
                ]}
                onPress={() =>
                  navigation.navigate('RepairDetail', { repairId: issue._id })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.categoryTag}>
                      {issue.issueType?.toUpperCase()}
                    </Text>
                    <Text style={styles.issueTitle} numberOfLines={1}>
                      {issue.description.replace(/^\[.*?\]\s*/, '')}
                    </Text>
                  </View>
                  <StatusBadge
                    status={issue.status}
                    label={issue.status?.replace('_', ' ')?.toUpperCase()}
                    size="small"
                  />
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.priorityPill}>
                    <Text
                      style={[
                        styles.priorityText,
                        (isCritical || isHigh) && { color: COLORS.danger },
                      ]}
                    >
                      Severity: {issue.priority?.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDate(issue.createdAt)}
                  </Text>
                </View>

                {issue.photos && issue.photos.length > 0 && (
                  <View style={styles.photoCountRow}>
                    <Text style={styles.photoCountText}>
                      📷 {issue.photos.length} photo(s) attached
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.trackLink}>Track repair workflow →</Text>
                </View>
              </Card>
            );
          })
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
  headerBtn: {
    paddingHorizontal: 12,
  },
  ctaCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    padding: 16,
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: 'column',
  },
  ctaTextContainer: {
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
  },
  ctaSub: {
    fontSize: 13,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 18,
  },
  ctaIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  issueCard: {
    padding: 16,
    marginVertical: 5,
  },
  criticalBorder: {
    borderColor: '#FCA5A5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 8,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  photoCountRow: {
    marginTop: 6,
  },
  photoCountText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'flex-end',
  },
  trackLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
});

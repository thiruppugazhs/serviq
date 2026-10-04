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
import { formatKm, formatDate, formatCurrency } from '../../utils/helpers';

export const ServiceHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchHistory = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getVehicleServiceHistory();
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      console.warn('History fetch error:', err.message);
      setErrorMessage(err.message || 'Unable to load service history.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchHistory();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading service records & work logs..." />;
  }

  if (errorMessage && history.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Service History" showBack onBack={() => navigation.goBack()} />
        <ErrorView message={errorMessage} onRetry={fetchHistory} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Service History"
        subtitle="Completed Services & Overhauls"
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
        {history.length === 0 ? (
          <EmptyState
            icon="📜"
            title="No Service History"
            message="No completed service records or repair tickets logged for this vehicle yet."
            actionTitle="Refresh"
            onAction={fetchHistory}
          />
        ) : (
          history.map((item, index) => (
            <Card key={item.id || index} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.typeTag}>
                    {item.type?.toUpperCase()}
                  </Text>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                </View>
                <StatusBadge status="completed" label="Completed" size="small" />
              </View>

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>DATE</Text>
                  <Text style={styles.metricValue}>{formatDate(item.date)}</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>ODOMETER</Text>
                  <Text style={styles.metricValue}>{formatKm(item.odometer)}</Text>
                </View>

                {item.cost ? (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>COST</Text>
                    <Text style={styles.metricValue}>
                      {formatCurrency(item.cost)}
                    </Text>
                  </View>
                ) : null}
              </View>

              {item.serviceCenter ? (
                <View style={styles.centerRow}>
                  <Text style={styles.centerLabel}>Facility:</Text>
                  <Text style={styles.centerValue}>{item.serviceCenter}</Text>
                </View>
              ) : null}

              {item.description ? (
                <View style={styles.descBox}>
                  <Text style={styles.descText}>{item.description}</Text>
                </View>
              ) : null}
            </Card>
          ))
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
  historyCard: {
    padding: 16,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flex: 1,
    paddingRight: 8,
  },
  typeTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.primaryLight,
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
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
  descBox: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  descText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

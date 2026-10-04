import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ErrorView } from '../../components/ErrorView';
import { api } from '../../services/api';
import { formatKm, formatDate } from '../../utils/helpers';

export const OdometerScreen = ({ navigation }) => {
  const [currentOdometer, setCurrentOdometer] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal update state
  const [modalVisible, setModalVisible] = useState(false);
  const [newReading, setNewReading] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState('');

  const fetchOdometerData = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getOdometerHistory();
      if (res.success) {
        setCurrentOdometer(res.currentOdometer || 0);
        setHistory(res.history || []);
      }
    } catch (err) {
      console.warn('Odometer fetch error:', err.message);
      setErrorMessage(err.message || 'Unable to load odometer history.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOdometerData();
  }, [fetchOdometerData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOdometerData();
  };

  const handleOpenModal = () => {
    setNewReading(currentOdometer ? String(currentOdometer) : '');
    setNotes('');
    setInputError('');
    setModalVisible(true);
  };

  const handleSubmitOdometer = async () => {
    setInputError('');
    const numericReading = Number(newReading.trim());

    if (!newReading.trim() || isNaN(numericReading)) {
      setInputError('Please enter a valid numeric reading.');
      return;
    }

    if (numericReading < currentOdometer) {
      setInputError(
        `Reading cannot be lower than current odometer (${formatKm(currentOdometer)}).`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.updateOdometer(numericReading, notes);
      if (res.success) {
        setCurrentOdometer(res.currentOdometer);
        setModalVisible(false);
        Alert.alert(
          'Odometer Updated',
          `Vehicle odometer successfully updated to ${formatKm(res.currentOdometer)}.`
        );
        fetchOdometerData();
      } else {
        throw new Error(res.message || 'Failed to update odometer');
      }
    } catch (err) {
      setInputError(err.message || 'Failed to update odometer reading.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading odometer records..." />;
  }

  if (errorMessage && history.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Odometer" showBack onBack={() => navigation.goBack()} />
        <ErrorView message={errorMessage} onRetry={fetchOdometerData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Odometer"
        subtitle="Telemetry & Distance Tracking"
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
        {/* Current Odometer Hero Card */}
        <Card style={styles.heroCard}>
          <Text style={styles.heroLabel}>CURRENT ODOMETER</Text>
          <Text style={styles.heroValue}>{formatKm(currentOdometer)}</Text>
          <Text style={styles.heroSub}>
            Logged for assigned vehicle
          </Text>

          <Button
            title="Update Odometer"
            variant="primary"
            size="large"
            icon={<Text style={styles.btnIcon}>⏱️</Text>}
            onPress={handleOpenModal}
            style={styles.updateButton}
          />
        </Card>

        {/* History List */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.historyTitle}>ODOMETER LOG HISTORY</Text>
          <Text style={styles.historyCount}>{history.length} records</Text>
        </View>

        {history.length === 0 ? (
          <Card style={styles.emptyHistoryCard}>
            <Text style={styles.emptyText}>No historical odometer logs found.</Text>
          </Card>
        ) : (
          history.map((log, index) => (
            <Card key={log._id || index} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <View style={styles.historyIconCircle}>
                    <Text style={styles.historyIcon}>🛣️</Text>
                  </View>
                  <View>
                    <Text style={styles.historyReading}>
                      {formatKm(log.reading)}
                    </Text>
                    {log.notes ? (
                      <Text style={styles.historyNotes} numberOfLines={1}>
                        {log.notes}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.historyRight}>
                  <Text style={styles.historyDate}>
                    {formatDate(log.recordedAt || log.createdAt)}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Update Odometer Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Odometer Reading</Text>
            <Text style={styles.modalSubtitle}>
              Current: {formatKm(currentOdometer)}
            </Text>

            <Input
              label="New Odometer Reading (km)"
              placeholder={`e.g. ${currentOdometer + 150}`}
              value={newReading}
              onChangeText={(t) => {
                setNewReading(t);
                setInputError('');
              }}
              keyboardType="numeric"
              error={inputError}
            />

            <Input
              label="Trip / Log Notes (Optional)"
              placeholder="e.g. End of day return to hub"
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={() => setModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Save Reading"
                variant="primary"
                size="medium"
                loading={isSubmitting}
                onPress={handleSubmitOdometer}
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
    paddingBottom: 32,
  },
  heroCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  updateButton: {
    width: '100%',
  },
  btnIcon: {
    fontSize: 18,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  historyCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  historyCard: {
    padding: 14,
    marginVertical: 4,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyIcon: {
    fontSize: 18,
  },
  historyReading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  historyNotes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    maxWidth: 180,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptyHistoryCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
});

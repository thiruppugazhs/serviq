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
import { formatDate } from '../../utils/helpers';

export const DocumentsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDocuments = useCallback(async () => {
    setErrorMessage('');
    try {
      const res = await api.getVehicleDocuments();
      if (res.success) {
        setDocuments(res.documents || []);
      }
    } catch (err) {
      console.warn('Documents fetch error:', err.message);
      setErrorMessage(err.message || 'Unable to load vehicle documents.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchDocuments();
  };

  if (isLoading) {
    return <LoadingScreen message="Verifying compliance documents..." />;
  }

  if (errorMessage && documents.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Documents" showBack onBack={() => navigation.goBack()} />
        <ErrorView message={errorMessage} onRetry={fetchDocuments} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Documents"
        subtitle="Compliance & Permits (View Only)"
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
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            📄 Mandatory transport documents for on-road inspection. Maintained by SERVIQ Fleet Administration.
          </Text>
        </View>

        {documents.length === 0 ? (
          <EmptyState
            icon="📁"
            title="No Documents Found"
            message="No active certificates or permits registered for this vehicle."
            actionTitle="Refresh"
            onAction={fetchDocuments}
          />
        ) : (
          documents.map((doc, index) => {
            const isExpired = doc.status === 'expired';
            const isExpiringSoon = doc.status === 'expiring_soon';

            let docIcon = '📄';
            if (doc.documentType?.includes('RC')) docIcon = '📋';
            if (doc.documentType?.includes('Insurance')) docIcon = '🛡️';
            if (doc.documentType?.includes('PUC')) docIcon = '🌱';
            if (doc.documentType?.includes('Permit')) docIcon = '🗺️';
            if (doc.documentType?.includes('Fitness')) docIcon = '🏅';
            if (doc.documentType?.includes('Licence')) docIcon = '🪪';

            return (
              <Card
                key={doc._id || index}
                style={[
                  styles.docCard,
                  isExpired && styles.cardExpired,
                  isExpiringSoon && styles.cardExpiring,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.docLeft}>
                    <View style={styles.iconBox}>
                      <Text style={styles.icon}>{docIcon}</Text>
                    </View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.docTitle}>{doc.documentType}</Text>
                      <Text style={styles.docNumber}>
                        {doc.documentNumber || 'Certificate On File'}
                      </Text>
                    </View>
                  </View>

                  <StatusBadge
                    status={doc.status}
                    label={doc.status?.replace('_', ' ')?.toUpperCase()}
                    size="small"
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>EXPIRY DATE</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        isExpired && { color: COLORS.danger, fontWeight: '800' },
                      ]}
                    >
                      {doc.expiryDate ? formatDate(doc.expiryDate) : 'Permanent / N/A'}
                    </Text>
                  </View>

                  {doc.issueDate ? (
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>ISSUE DATE</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(doc.issueDate)}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {doc.notes ? (
                  <Text style={styles.notesText}>{doc.notes}</Text>
                ) : null}
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
  docCard: {
    padding: 16,
    marginVertical: 6,
  },
  cardExpired: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  cardExpiring: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  docNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

import React, { useState } from 'react';
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
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, formatDateTime } from '../../utils/helpers';

export const NotificationsScreen = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'repair':
        return '🔧';
      case 'maintenance':
        return '🗓️';
      case 'vehicle':
        return '🚛';
      case 'document':
        return '📄';
      default:
        return '🔔';
    }
  };

  const handleNotificationPress = async (item) => {
    if (!item.isRead) {
      await markAsRead(item._id || item.id);
    }

    // Deep link navigation
    if (item.type === 'repair' || item.link?.includes('repair')) {
      navigation.navigate('IssuesTab');
    } else if (item.type === 'maintenance' || item.link?.includes('maintenance')) {
      navigation.navigate('Maintenance');
    } else if (item.type === 'vehicle' || item.link?.includes('vehicle')) {
      navigation.navigate('VehicleTab');
    } else if (item.type === 'document' || item.link?.includes('document')) {
      navigation.navigate('Documents');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        rightAction={
          unreadCount > 0 ? (
            <Button
              title="Mark All Read"
              variant="outline"
              size="small"
              onPress={markAllAsRead}
              style={styles.markReadBtn}
            />
          ) : null
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
        {notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No Notifications"
            message="You have no notifications or dispatch alerts at the moment."
            actionTitle="Refresh"
            onAction={fetchNotifications}
          />
        ) : (
          notifications.map((item) => {
            const isUnread = !item.isRead;

            return (
              <Card
                key={item._id || item.id}
                style={[
                  styles.notifCard,
                  isUnread && styles.unreadCard,
                ]}
                onPress={() => handleNotificationPress(item)}
              >
                <View style={styles.notifRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      isUnread && styles.iconCircleUnread,
                    ]}
                  >
                    <Text style={styles.icon}>{getNotifIcon(item.type)}</Text>
                  </View>

                  <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.title,
                          isUnread && styles.titleUnread,
                        ]}
                      >
                        {item.title}
                      </Text>
                      {isUnread && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.message}>{item.message}</Text>

                    <Text style={styles.timestamp}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
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
  markReadBtn: {
    paddingHorizontal: 8,
  },
  notifCard: {
    padding: 14,
    marginVertical: 4,
  },
  unreadCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryLight,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  iconCircleUnread: {
    backgroundColor: '#DBEAFE',
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  titleUnread: {
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    marginLeft: 6,
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});

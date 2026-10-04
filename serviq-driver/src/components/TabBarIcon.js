import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const TabBarIcon = ({ routeName, focused, badgeCount = 0 }) => {
  let icon = '🏠';

  switch (routeName) {
    case 'HomeTab':
      icon = '🏠';
      break;
    case 'VehicleTab':
      icon = '🚛';
      break;
    case 'IssuesTab':
      icon = '⚠️';
      break;
    case 'NotificationsTab':
      icon = '🔔';
      break;
    case 'ProfileTab':
      icon = '👤';
      break;
    default:
      icon = '🔘';
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { VehicleScreen } from '../screens/vehicle/VehicleScreen';
import { IssuesScreen } from '../screens/issues/IssuesScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TabBarIcon } from '../components/TabBarIcon';
import { COLORS } from '../constants/colors';
import { useNotifications } from '../context/NotificationContext';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const { unreadCount } = useNotifications();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon routeName="HomeTab" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="VehicleTab"
        component={VehicleScreen}
        options={{
          tabBarLabel: 'Vehicle',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon routeName="VehicleTab" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="IssuesTab"
        component={IssuesScreen}
        options={{
          tabBarLabel: 'Issues',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon routeName="IssuesTab" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              routeName="NotificationsTab"
              focused={focused}
              badgeCount={unreadCount}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon routeName="ProfileTab" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

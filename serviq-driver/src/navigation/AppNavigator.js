import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { VehicleHealthScreen } from '../screens/vehicle/VehicleHealthScreen';
import { MaintenanceScreen } from '../screens/vehicle/MaintenanceScreen';
import { ServiceHistoryScreen } from '../screens/vehicle/ServiceHistoryScreen';
import { OdometerScreen } from '../screens/vehicle/OdometerScreen';
import { DocumentsScreen } from '../screens/vehicle/DocumentsScreen';
import { ReportIssueScreen } from '../screens/issues/ReportIssueScreen';
import { RepairDetailScreen } from '../screens/repairs/RepairDetailScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Connecting to SERVIQ fleet..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Authenticated Driver Stack
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="VehicleHealth" component={VehicleHealthScreen} />
            <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
            <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} />
            <Stack.Screen name="Odometer" component={OdometerScreen} />
            <Stack.Screen name="Documents" component={DocumentsScreen} />
            <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
            <Stack.Screen name="RepairDetail" component={RepairDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

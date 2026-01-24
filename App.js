import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import NotificationScreen from './screens/NotificationScreen';
import AIHelperScreen from './screens/AIHelperScreen';

const Stack = createNativeStackNavigator();

/**
 * Notification handler (required for SDK 54)
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // Ask notification permission on app start
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        {/* Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Main App */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Classic App' }}
        />

        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Camera' }}
        />

        <Stack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{ title: 'Notifications' }}
        />

        <Stack.Screen
          name="AI Assistant"
          component={AIHelperScreen}
          options={{ title: 'AI Assistant' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

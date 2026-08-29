import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TripDashboardScreen from '../screens/TripDashboardScreen';
import PlanTripScreen from '../screens/PlanTripScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import MapScreen from '../screens/MapScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import RecapScreen from '../screens/RecapScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.orange} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{ dark: true, colors: { background: colors.black, card: colors.black, text: '#fff', border: '#222', primary: colors.orange, notification: colors.orange } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={TripDashboardScreen} />
            <Stack.Screen name="PlanTrip" component={PlanTripScreen} />
            <Stack.Screen name="Expenses" component={ExpenseScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="ChatBot" component={ChatBotScreen} />
            <Stack.Screen name="Recap" component={RecapScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

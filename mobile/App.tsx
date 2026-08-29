import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// Context
import { AuthContext } from './src/context/AuthContext';
import { TripContext } from './src/context/TripContext';

// Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import TripsListScreen from './src/screens/trips/TripsListScreen';
import TripDetailsScreen from './src/screens/trips/TripDetailsScreen';
import CreateTripScreen from './src/screens/trips/CreateTripScreen';
import ExpenseListScreen from './src/screens/expenses/ExpenseListScreen';
import AddExpenseScreen from './src/screens/expenses/AddExpenseScreen';
import SettleUpScreen from './src/screens/settleup/SettleUpScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import MapScreen from './src/screens/map/MapScreen';
import TripRecapScreen from './src/screens/recap/TripRecapScreen';
import JoinTripScreen from './src/screens/trips/JoinTripScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          title: 'Travel Expense Tracker'
        }}
      />
      <Stack.Screen
        name="TripDetails"
        component={TripDetailsScreen}
        options={{
          title: 'Trip Details'
        }}
      />
      <Stack.Screen
        name="CreateTrip"
        component={CreateTripScreen}
        options={{
          title: 'Create New Trip'
        }}
      />
      <Stack.Screen
        name="JoinTrip"
        component={JoinTripScreen}
        options={{
          title: 'Join Trip'
        }}
      />
    </Stack.Navigator>
  );
};

const TripsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B'
        },
        headerTintColor: '#fff'
      }}
    >
      <Stack.Screen
        name="TripsMain"
        component={TripsListScreen}
        options={{
          title: 'My Trips'
        }}
      />
      <Stack.Screen
        name="TripDetailsStack"
        component={TripDetailsScreen}
        options={{
          title: 'Trip Details'
        }}
      />
    </Stack.Navigator>
  );
};

const ExpenseStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B'
        },
        headerTintColor: '#fff'
      }}
    >
      <Stack.Screen
        name="ExpenseMain"
        component={ExpenseListScreen}
        options={{
          title: 'Expenses'
        }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          title: 'Add Expense'
        }}
      />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee'
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsStack}
        options={{
          title: 'Trips',
          tabBarLabel: 'Trips'
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseStack}
        options={{
          title: 'Expenses',
          tabBarLabel: 'Expenses'
        }}
      />
      <Tab.Screen
        name="SettleUp"
        component={SettleUpScreen}
        options={{
          title: 'Settle Up',
          tabBarLabel: 'Settle Up'
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Travel Buddy',
          tabBarLabel: 'Travel Buddy'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Failed to restore token', e);
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        // Implementation in AuthContext
        dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
      },
      signUp: async (email, password, name) => {
        // Implementation in AuthContext
        dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
      signInWithGoogle: async () => {
        // Implementation in AuthContext
        dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
      }
    }),
    []
  );

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <TripContext.Provider value={{}}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.userToken == null ? (
              <Stack.Screen
                name="Auth"
                component={AuthStack}
                options={{
                  animationEnabled: false
                }}
              />
            ) : (
              <Stack.Screen
                name="App"
                component={AppTabs}
                options={{
                  animationEnabled: false
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </TripContext.Provider>
    </AuthContext.Provider>
  );
}

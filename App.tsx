import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from './src/store';
import { restoreCredentials } from './src/store/slices/authSlice';
import { authService } from './src/services/authService';

// Import your screens
// import RegisterScreen from './screens/RegisterScreen';
// import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from 'src/screens/Login';
// Import other screens as needed

// Define your navigation stack param list
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
  // Add other routes as needed
};

const Stack = createStackNavigator<RootStackParamList>();

// Auth Navigator - for screens that don't require authentication
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

// Main Navigator - for authenticated screens
const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {/* Add other authenticated screens here */}
    </Stack.Navigator>
  );
};

// Navigation Root component that handles auth state
const NavigationRoot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check for stored credentials on app start
    const loadStoredCredentials = async () => {
      try {
        const credentials = await authService.loadStoredCredentials();
        if (credentials) {
          dispatch(restoreCredentials(credentials));
        }
      } catch (error) {
        console.error('Failed to restore credentials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredCredentials();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Main App component
const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationRoot />
      </PaperProvider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;
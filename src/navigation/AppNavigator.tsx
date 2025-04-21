import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Login';

// Import screens
// import SplashScreen from '../screens/SplashScreen';
// import LoginScreen from '../screens/Login';

// Placeholder components for screens you'll implement later
const RegisterScreen = () => null;
const ForgotPasswordScreen = () => null;
const DashboardScreen = () => null;
// Add other placeholder screens as needed

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#F5F5F5' }
            }}
        >
            {/* Authentication Flow */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

            {/* Main App Flow */}
            <Stack.Screen name="Dashboard" component={DashboardScreen} />

            {/* Add other screens as you implement them */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
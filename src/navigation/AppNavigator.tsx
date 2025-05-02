import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Login';
import DashboardScreen from '../screens/DashboardScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProjectDetailScreen from '../screens/ProjectDetailsScreen';
import ProfileScreen from 'src/screens/ProfileScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen'; // Import the new screen

// Define the root stack parameter list type
export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    Profile: undefined;
    ProjectDetail: { projectId: string };
    CreateTask: { projectId?: string }; // Add this new route
};

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

            {/* Main App Flow */}
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="CreateTask" component={CreateTaskScreen} />

            {/* Add other screens as you implement them */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
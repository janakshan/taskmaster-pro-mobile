import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

// Import HomeScreen correctly - adjust path as needed

// Define the tab navigator param list
type TabParamList = {
    Home: undefined;
    Calendar: undefined;
    Add: undefined;
    Notifications: undefined;
    Profile: undefined;
};

// Type for the route in screenOptions
type TabRouteProp = RouteProp<TabParamList, keyof TabParamList>;

// Placeholder screens for other tabs
// const ProfileScreen: React.FC = () => (
//     <View style={styles.placeholderContainer}>
//         <Text style={styles.placeholderText}>Profile Screen</Text>
//     </View>
// );

const NotificationsScreen: React.FC = () => (
    <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Notifications Screen</Text>
    </View>
);

const CalendarScreen: React.FC = () => (
    <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Calendar Screen</Text>
    </View>
);

// Create the tab navigator with proper typing
const Tab = createBottomTabNavigator<TabParamList>();

// Type for tabBarIcon props
interface TabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}

const DashboardScreen: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: TabRouteProp }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#6c5ce7',
                tabBarInactiveTintColor: '#999',
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    shadowOffset: { height: -3, width: 0 },
                },
                tabBarIcon: ({ color, size, focused }: TabBarIconProps) => {
                    let iconName: string = '';

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Calendar') {
                        iconName = 'calendar';
                    } else if (route.name === 'Add') {
                        return (
                            <View style={styles.addButtonContainer}>
                                <View style={styles.addButton}>
                                    <Icon name="plus" size={24} color="white" />
                                </View>
                            </View>
                        );
                    } else if (route.name === 'Notifications') {
                        iconName = 'bell';
                    } else if (route.name === 'Profile') {
                        iconName = 'user';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen
                name="Add"
                component={HomeScreen}
                listeners={{
                    tabPress: (e) => {
                        // Prevent default behavior
                        e.preventDefault();

                        // Handle action for add button
                        // This could open a modal or navigate to an add screen
                        Alert.alert('Add button pressed');
                    },
                }}
            />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    placeholderText: {
        fontSize: 20,
        color: '#333',
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 0, // Adjust as needed
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
});

export default DashboardScreen;
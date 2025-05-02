// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Searchbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import CompletedProjects from '../components/CompletedProjects';
import OngoingProjects from '../components/OngoingProjects';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Define the navigation parameter list
type RootStackParamList = {
    Home: undefined;
    ProjectDetail: { projectId: string };
    Profile: undefined;
    CreateProject: undefined;
};

// Type for navigation prop
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const user = useSelector((state: RootState) => state.auth.user);

    console.log('user', user)

    // Navigate to profile screen
    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    // Handle "See All" button press
    const handleSeeAllCompletedProjects = () => {
        console.log('Navigate to all completed projects');
    // You can implement this navigation later
    };

    const handleSeeAllOngoingProjects = () => {
        console.log('Navigate to all ongoing projects');
        // You can implement this navigation later
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeBack}>Welcome Back!</Text>
                    <TouchableOpacity onPress={handleProfilePress}>
                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleProfilePress}>
                    <Avatar.Image
                        source={{
                            uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
                        }}
                        size={50}
                        style={styles.userAvatar}
                    />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {/* <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search projects"
                    style={styles.searchBar}
                    iconColor="#757575"
                    inputStyle={styles.searchInput}
                    onChangeText={() => { }}
                    value=""
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="sliders" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View> */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Completed Projects Component */}
                <CompletedProjects
                    onSeeAllPress={handleSeeAllCompletedProjects}
                />

                {/* Ongoing Projects Component */}
                <OngoingProjects
                    onSeeAllPress={handleSeeAllOngoingProjects}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    welcomeBack: {
        fontSize: 16,
        color: '#333333',
    },
    userName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6c5ce7',
        marginTop: 4,
    },
    userAvatar: {
        backgroundColor: '#6c5ce7',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        elevation: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        height: 50,
    },
    searchInput: {
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#6c5ce7',
        width: 50,
        height: 50,
        borderRadius: 8,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 80, // Space for bottom navigation
    },
});

export default HomeScreen;
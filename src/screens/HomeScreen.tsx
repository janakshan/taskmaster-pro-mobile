import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Searchbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import CompletedProjects from 'src/components/CompletedProjects';
import OngoingProjects from 'src/components/OngoingProjects';


// Types
type TeamMember = {
    id: number;
    avatar: string;
};

type Task = {
    id: number;
    title: string;
    completed: boolean;
};

type CompletedTask = {
    id: number;
    title: string;
    teamMembers: TeamMember[];
    progress: number;
    color: string;
};

type Project = {
    id: number;
    title: string;
    teamMembers: TeamMember[];
    dueDate: string;
    progress: number;
    description: string;
    totalTasks: number;
    completedTasks: number;
    tasks: Task[];
};

// Define the navigation parameter list
type RootStackParamList = {
    Home: undefined;
    ProjectDetail: { project: Project };
    Profile: undefined;
    CreateProject: undefined;
};

// Type for navigation prop
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    // Mock data for completed tasks
    const completedTasks: CompletedTask[] = [
        {
            id: 1,
            title: 'Real Estate Website Design',
            teamMembers: [
                { id: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
                { id: 2, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
                { id: 3, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
                { id: 4, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
                { id: 5, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
            ],
            progress: 1, // 100%
            color: '#6c5ce7',
        },
        {
            id: 2,
            title: 'Finance Mobile App Design',
            teamMembers: [
                { id: 1, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
                { id: 2, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
                { id: 3, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
                { id: 4, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
                { id: 5, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
            ],
            progress: 1, // 100%
            color: '#5F99AE',
        },
        {
            id: 3,
            title: 'Agoda Resume Generation',
            teamMembers: [
                { id: 1, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
                { id: 2, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
                { id: 3, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
                { id: 4, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
                { id: 5, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
            ],
            progress: 1, // 100%
            color: '#5F99AE',
        },
    ];

    // Mock data for ongoing projects
    const ongoingProjects: Project[] = [
        {
            id: 1,
            title: 'Mobile App Wireframe',
            teamMembers: [
                { id: 1, avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
                { id: 2, avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
                { id: 3, avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
            ],
            dueDate: '21 March',
            progress: 0.75, // 75%
            description: 'Creating wireframes for mobile app project including user flows and interaction design',
            totalTasks: 10,
            completedTasks: 7,
            tasks: [
                { id: 1, title: 'User Research', completed: true },
                { id: 2, title: 'Sitemap Creation', completed: true },
                { id: 3, title: 'Low-Fi Wireframes', completed: true },
                { id: 4, title: 'Usability Testing', completed: false },
                { id: 5, title: 'Final Wireframes', completed: false },
            ]
        },
        {
            id: 2,
            title: 'Real Estate App Design',
            teamMembers: [
                { id: 1, avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
                { id: 2, avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
                { id: 3, avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
            ],
            dueDate: '20 June',
            progress: 0, // 0%
            description: 'Design a comprehensive real estate application with property search, filtering, and detailed listing views',
            totalTasks: 10,
            completedTasks: 0,
            tasks: [
                { id: 1, title: 'User Interviews', completed: true },
                { id: 2, title: 'Wireframes', completed: true },
                { id: 3, title: 'Design System', completed: true },
                { id: 4, title: 'Icons', completed: false },
                { id: 5, title: 'Final Mockups1', completed: false },
                { id: 6, title: 'Usability Testing', completed: false },
                { id: 7, title: 'Prototyping', completed: false },
                { id: 8, title: 'Developer Handoff', completed: false },
                { id: 9, title: 'Client Meeting', completed: false },
                { id: 10, title: 'Project Review', completed: false },
            ]
        },
        {
            id: 3,
            title: 'Dashboard & App Design',
            teamMembers: [
                { id: 1, avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
                { id: 2, avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
                { id: 3, avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
            ],
            dueDate: '15 May',
            progress: 0.45, // 45%
            description: 'Create an analytics dashboard with data visualization, real-time updates, and customizable widgets',
            totalTasks: 12,
            completedTasks: 5,
            tasks: [
                { id: 1, title: 'Requirements Gathering', completed: true },
                { id: 2, title: 'Dashboard Wireframes', completed: true },
                { id: 3, title: 'UI Component Design', completed: true },
                { id: 4, title: 'Chart Design', completed: false },
                { id: 5, title: 'User Testing', completed: false },
            ]
        },
    ];

    // Navigate to profile screen
    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    // Handle "See All" button press
    const handleSeeAllCompletedTasks = () => {
        console.log('Navigate to all completed tasks');
    };

    const handleSeeAllOngoingProjects = () => {
        console.log('Navigate to all ongoing projects');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeBack}>Welcome Back!</Text>
                    <TouchableOpacity onPress={handleProfilePress}>
                        <Text style={styles.userName}>Fazil Laghari</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleProfilePress}>
                    <Avatar.Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        size={50}
                        style={styles.userAvatar}
                    />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search tasks"
                    style={styles.searchBar}
                    iconColor="#757575"
                    inputStyle={styles.searchInput}
                    onChangeText={() => { }}
                    value=""
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="sliders" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Completed Tasks Component */}
                <CompletedProjects
                    tasks={completedTasks}
                    onSeeAllPress={handleSeeAllCompletedTasks}
                />

                {/* Ongoing Projects Component */}
                <OngoingProjects
                    projects={ongoingProjects}
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
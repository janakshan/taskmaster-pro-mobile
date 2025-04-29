import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { Searchbar, Card, ProgressBar, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function HomeScreen() {
    const navigation = useNavigation();

    // Mock data for completed tasks
    const completedTasks = [
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
    const ongoingProjects = [
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
            progress: 0.6, // 60%
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
        },
    ];

    // Render team members avatars with overlap effect
    const renderTeamMembers = (members) => {
        const visibleMembers = members.slice(0, 4); // Show only first 4 members
        const remainingCount = members.length - 4;

        return (
            <View style={styles.teamMembersContainer}>
                {visibleMembers.map((member, index) => (
                    <Avatar.Image
                        key={member.id}
                        source={{ uri: member.avatar }}
                        size={30}
                        style={[
                            styles.memberAvatar,
                            { marginLeft: index > 0 ? -12 : 0 },
                        ]}
                    />
                ))}
                {remainingCount > 0 && (
                    <View style={styles.remainingMembersContainer}>
                        <Text style={styles.remainingMembersText}>+{remainingCount}</Text>
                    </View>
                )}
            </View>
        );
    };

    // Render a progress circle for ongoing projects
    const renderProgressCircle = (progress) => {
        const percentage = Math.round(progress * 100);
        const circumference = 2 * Math.PI * 30; // Circle with radius 30
        const strokeDashoffset = circumference * (1 - progress);

        return (
            <View style={styles.progressCircleContainer}>
                <View style={styles.progressCircleWrapper}>
                    <View style={styles.progressCircle}>
                        <Text style={styles.progressText}>{percentage}%</Text>
                    </View>
                    <View style={styles.progressCircleBackground} />
                    <View
                        style={[
                            styles.progressCircleValue,
                            {
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset
                            }
                        ]}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeBack}>Welcome Back!</Text>
                    <Text style={styles.userName}>Fazil Laghari</Text>
                </View>
                <Avatar.Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    size={50}
                    style={styles.userAvatar}
                />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search tasks"
                    style={styles.searchBar}
                    iconColor="#757575"
                    inputStyle={styles.searchInput}
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="sliders" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Completed Tasks Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Completed Tasks</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                {/* Horizontal Scroll for Completed Tasks */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScrollContent}
                >
                    {completedTasks.map((task) => (
                        <Card key={task.id} style={[styles.completedTaskCard, { backgroundColor: task.color }]}>
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.completedTaskTitle}>{task.title}</Text>
                                <View style={styles.taskInfoContainer}>
                                    <Text style={styles.teamMembersLabel}>Team members</Text>
                                    {renderTeamMembers(task.teamMembers)}
                                </View>
                                <View style={styles.completedContainer}>
                                    <Text style={styles.completedText}>Completed</Text>
                                    <Text style={styles.completedPercentage}>
                                        {Math.round(task.progress * 100)}%
                                    </Text>
                                </View>
                                <ProgressBar
                                    progress={task.progress}
                                    color="#ffffff"
                                    style={styles.progressBar}
                                />
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>

                {/* Ongoing Projects Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Ongoing Projects</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                {/* List of Ongoing Projects */}
                {ongoingProjects.map((project) => (
                    <Card key={project.id} style={styles.ongoingProjectCard}>
                        <Card.Content style={styles.projectCardContent}>
                            <View style={styles.projectMainInfo}>
                                <View>
                                    <Text style={styles.projectTitle}>{project.title}</Text>
                                    <Text style={styles.teamMembersLabel}>Team members</Text>
                                    {renderTeamMembers(project.teamMembers)}
                                    <Text style={styles.dueDate}>
                                        Due on : {project.dueDate}
                                    </Text>
                                </View>
                                {renderProgressCircle(project.progress)}
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNavContainer}>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="home" size={24} color="#ffffff" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Icon name="message-circle" size={24} color="#9d9fdc" />
                    <Text style={styles.navTextInactive}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButton}>
                    <Icon name="plus" size={24} color="#6c5ce7" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Icon name="calendar" size={24} color="#9d9fdc" />
                    <Text style={styles.navTextInactive}>Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Icon name="bell" size={24} color="#9d9fdc" />
                    <Text style={styles.navTextInactive}>Notification</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
    },
    seeAllText: {
        fontSize: 16,
        color: '#6c5ce7',
        fontWeight: '500',
    },
    horizontalScrollContent: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    completedTaskCard: {
        width: 240,
        borderRadius: 12,
        marginRight: 15,
        elevation: 4,
    },
    cardContent: {
        padding: 5,
    },
    completedTaskTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },
    taskInfoContainer: {
        marginBottom: 20,
    },
    teamMembersLabel: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 8,
    },
    teamMembersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberAvatar: {
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    remainingMembersContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -12,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    remainingMembersText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    completedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    completedText: {
        fontSize: 14,
        color: '#ffffff',
    },
    completedPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    ongoingProjectCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 12,
        // backgroundColor: '#FAC67A',
        backgroundColor: '#FFE6C9',
        elevation: 2,
    },
    projectCardContent: {
        padding: 10,
    },
    projectMainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 15,
    },
    dueDate: {
        fontSize: 14,
        color: '#666666',
        marginTop: 10,
    },
    progressCircleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressCircleWrapper: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        elevation: 2,
    },
    progressCircleBackground: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#e0e0e0',
    },
    progressCircleValue: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#6c5ce7',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        transform: [{ rotateZ: '-90deg' }],
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c5ce7',
    },
    bottomNavContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#6c5ce7',
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingBottom: 10, // Add padding to avoid cutting off on devices with home indicators
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#ffffff',
        marginTop: 4,
    },
    navTextInactive: {
        fontSize: 12,
        color: '#9d9fdc',
        marginTop: 4,
    },
    addButton: {
        backgroundColor: '#ffffff',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 5,
    },
});
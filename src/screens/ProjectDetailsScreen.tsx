import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ViewStyle, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';

// Define types
type TeamMember = {
    id: number;
    avatar: string;
};

type Task = {
    id: number;
    title: string;
    completed: boolean;
};

type Project = {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    progress: number;
    totalTasks: number;
    completedTasks: number;
    team: TeamMember[];
    tasks: Task[];
};

// Define the param list for navigation
type RootStackParamList = {
    Home: undefined;
    ProjectDetail: { project: Project };
};

// Type for navigation
type ProjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetail'>;

// Type for route
type ProjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;

const ProjectDetailScreen: React.FC = () => {
    const navigation = useNavigation<ProjectDetailScreenNavigationProp>();
    const route = useRoute<ProjectDetailScreenRouteProp>();

    // Add a null check when extracting project from params
    const project = route.params?.project;

    // For demo purposes, if no project is passed, use this default data
    const defaultProject: Project = {
        id: 1,
        title: 'Real Estate App Design',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled',
        dueDate: '20 June',
        progress: 0.6, // 60%
        totalTasks: 10, // Updated to match total
        completedTasks: 3,
        team: [
            { id: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
            { id: 2, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            { id: 3, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        ],
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
    };

    // Use state to manage project data so we can update task completion status
    const [projectData, setProjectData] = useState<Project>(project || defaultProject);

    // Function to toggle task completion status
    const toggleTaskCompletion = (taskId: number) => {
        setProjectData(prevData => {
            // Create a new tasks array with the updated completion status for the selected task
            const updatedTasks = prevData.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );

            // Count the number of completed tasks
            const completedTasksCount = updatedTasks.filter(task => task.completed).length;

            // Calculate the new progress
            const newProgress = prevData.totalTasks > 0
                ? completedTasksCount / prevData.totalTasks
                : 0;

            // Return the updated project data
            return {
                ...prevData,
                tasks: updatedTasks,
                completedTasks: completedTasksCount,
                progress: newProgress
            };
        });
    };

    // Render team members avatars with overlap effect - with null checks
    const renderTeamMembers = (members: TeamMember[] | undefined): JSX.Element => {
        // Add null check for members array
        if (!members || !Array.isArray(members) || members.length === 0) {
            return (
                <View style={styles.teamMembersContainer}>
                    <Text style={styles.noMembersText}>No team members</Text>
                </View>
            );
        }

        return (
            <View style={styles.teamMembersContainer}>
                {members.map((member, index) => (
                    <Avatar.Image
                        key={member.id}
                        source={{ uri: member.avatar }}
                        size={36}
                        style={[
                            styles.memberAvatar,
                            { marginLeft: index > 0 ? -10 : 0 },
                        ]}
                    />
                ))}
            </View>
        );
    };

    // Render circular progress indicator
    const renderCircularProgress = (progress: number | undefined): JSX.Element => {
        // Add null check for progress
        const safeProgress = typeof progress === 'number' ? progress : 0;
        const percentage = Math.round(safeProgress * 100);
        const size = 80;
        const strokeWidth = 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = circumference - (safeProgress * circumference);

        return (
            <View style={styles.progressCircle}>
                <View style={{ width: size, height: size }}>
                    {/* Background Circle */}
                    <View style={[styles.circleBackground, {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                    }]} />

                    {/* Progress Circle - using styles instead of inline props for strokeDasharray */}
                    <View style={[
                        styles.circleProgress,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            transform: [{ rotateZ: '-90deg' }]
                        } as ViewStyle,
                        // Apply these as a separate style object with type assertion
                        {
                            borderColor: '#6c5ce7',
                            borderLeftColor: 'transparent',
                            borderBottomColor: 'transparent',
                        } as ViewStyle,
                        // Use custom property as a style with type assertion
                        {
                            // @ts-ignore - custom property for SVG-like styling
                            strokeDasharray: circumference,
                            // @ts-ignore - custom property for SVG-like styling
                            strokeDashoffset: strokeDashoffset
                        } as ViewStyle
                    ]} />

                    {/* Percentage Text */}
                    <View style={[styles.circleCenter, { width: size, height: size }]}>
                        <Text style={styles.progressPercentage}>{percentage}%</Text>
                    </View>
                </View>
            </View>
        );
    };

    // Task item renderer for FlatList
    const renderTaskItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleTaskCompletion(item.id)}
                activeOpacity={0.7}
            >
                {item.completed ? (
                    <View style={styles.checkedBox}>
                        <Icon name="check" size={18} color="#6c5ce7" />
                    </View>
                ) : (
                    <View style={styles.uncheckedBox} />
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <SafeAreaView style={styles.safeTop}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Project Details</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            {/* Main content (not scrollable) */}
            <View style={styles.mainContent}>
                {/* Project Title */}
                <Text style={styles.projectTitle}>{projectData.title || 'Untitled Project'}</Text>

                {/* Project Details Cards */}
                <View style={styles.detailsCards}>
                    <View style={styles.detailCard}>
                        <View style={styles.cardIconContainer}>
                            <Icon name="calendar" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardLabel}>Due Date</Text>
                            <Text style={styles.cardValue}>{projectData.dueDate || 'No date set'}</Text>
                        </View>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={styles.cardIconContainer}>
                            <Icon name="users" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardLabel}>Project Team</Text>
                            {renderTeamMembers(projectData.team)}
                        </View>
                    </View>
                </View>

                {/* Project Description */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Project Details</Text>
                    <Text style={styles.projectDescription}>
                        {projectData.description || 'No description available'}
                    </Text>
                </View>

                {/* Project Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.sectionTitle}>Project Progress</Text>
                    <View style={styles.progressRow}>
                        <View style={styles.progressInfo}>
                            <Text style={styles.taskStats}>
                                Tasks: {projectData.completedTasks || 0}/{projectData.totalTasks || 0}
                            </Text>
                        </View>
                        {renderCircularProgress(projectData.progress)}
                    </View>
                </View>

                {/* Tasks List Title */}
                <Text style={styles.sectionTitle}>All Tasks</Text>
            </View>

            {/* Tasks List as its own section with FlatList */}
            <View style={styles.taskListContainer}>
                {projectData.tasks && projectData.tasks.length > 0 ? (
                    <FlatList
                        data={projectData.tasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderTaskItem}
                        style={styles.tasksList}
                        contentContainerStyle={styles.tasksListContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.noTasksContainer}>
                                <Text style={styles.noTasksText}>No tasks available</Text>
                            </View>
                        }
                    />
                ) : (
                    <View style={styles.noTasksContainer}>
                        <Text style={styles.noTasksText}>No tasks available</Text>
                    </View>
                )}
            </View>

            {/* Fixed Add Task Button */}
            <SafeAreaView style={styles.safeBottom}>
                <View style={styles.fixedButtonContainer}>
                    <TouchableOpacity style={styles.addTaskButton}>
                        <Text style={styles.addTaskText}>Add Task</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    safeTop: {
        backgroundColor: '#ffffff',
    },
    safeBottom: {
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666666',
    },
    mainContent: {
        paddingHorizontal: 20,
    },
    projectTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 24,
    },
    detailsCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTextContainer: {
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    teamMembersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    memberAvatar: {
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    noMembersText: {
        fontSize: 14,
        color: '#999999',
        fontStyle: 'italic',
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6c5ce7',
        marginBottom: 12,
    },
    projectDescription: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
    },
    progressContainer: {
        marginBottom: 30,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressInfo: {
        flex: 1,
    },
    taskStats: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 8,
    },
    progressCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleBackground: {
        position: 'absolute',
        borderColor: '#E0E0E0',
    },
    circleProgress: {
        position: 'absolute',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    circleCenter: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c5ce7',
    },
    taskListContainer: {
        flex: 1, // Take all remaining space
        paddingHorizontal: 20,
        marginBottom: 90, // Make room for the button
    },
    tasksList: {
        flex: 1,
    },
    tasksListContent: {
        paddingBottom: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#6c5ce7',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 4,
        marginBottom: 8,
        height: 60,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#FFFFFF',
        // Make sure task title doesn't overlap with checkbox
        flex: 1,
        marginRight: 10,
    },
    checkboxContainer: {
        width: 28,
        height: 28,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uncheckedBox: {
        width: 28,
        height: 28,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    noTasksContainer: {
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTasksText: {
        fontSize: 16,
        color: '#999999',
        fontStyle: 'italic',
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 45,
        paddingVertical: 25,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    addTaskButton: {
        backgroundColor: '#F8B55F',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
    },
    addTaskText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
    }
});

export default ProjectDetailScreen;
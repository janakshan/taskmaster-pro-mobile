import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ViewStyle, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { useGetProjectByIdQuery } from 'src/store/slices/api/projectsApi';

// Define the param list for navigation
type RootStackParamList = {
    Home: undefined;
    ProjectDetail: { projectId: string };
};

// Type for navigation
type ProjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetail'>;

// Type for route
type ProjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;


const ProjectDetailScreen: React.FC = () => {
    const navigation = useNavigation<ProjectDetailScreenNavigationProp>();
    const route = useRoute<ProjectDetailScreenRouteProp>();

    // Extract projectId from route params
    const projectId = route.params?.projectId;

    // Use RTK Query hook to fetch project data
    const {
        data: project,
        isLoading,
        isError,
        error
    } = useGetProjectByIdQuery(projectId, {
        skip: !projectId // Skip if no projectId is provided
    });

    // Tasks state with placeholder data
    // In a real app, you'd want to fetch tasks from another API endpoint
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Read and analyze the project brief', completed: true, date: 'Oct 14, 8:30 PM' },
        { id: 2, title: 'Identify all relevant stakeholders', completed: true, date: 'Oct 08, 8:30 PM' },
        { id: 3, title: 'Set Timeline and Milestones', completed: false, date: 'Oct 18, 8:30 PM' },
        { id: 4, title: 'Icons', completed: false, date: 'Oct 20, 8:30 PM' },
        { id: 5, title: 'Final Mockups', completed: false, date: 'Oct 25, 8:30 PM' },
        { id: 6, title: 'Usability Testing', completed: false, date: 'Oct 29, 8:30 PM' },
        { id: 7, title: 'Prototyping', completed: false, date: 'Nov 02, 8:30 PM' },
        { id: 8, title: 'Developer Handoff', completed: false, date: 'Nov 05, 8:30 PM' },
        { id: 9, title: 'Client Meeting', completed: false, date: 'Nov 10, 8:30 PM' },
        { id: 10, title: 'Project Review', completed: false, date: 'Nov 15, 8:30 PM' },
    ]);

    // Calculate project progress based on completed tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

    // Function to toggle task completion status
    const toggleTaskCompletion = (taskId: number) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // Render team members avatars with overlap effect
    const renderTeamMembers = () => {
        // Check if project and members exist
        if (!project || !project.members || project.members.length === 0) {
            return (
                <View style={styles.teamMembersContainer}>
                    <Text style={styles.noMembersText}>No team members</Text>
                </View>
            );
        }

        return (
            <View style={styles.teamMembersContainer}>
                {project.members.map((member, index) => {
                    // Get avatar from member.user or use owner's avatar as fallback
                    const avatar = member.user?.avatar || project.owner?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg';

                    return (
                        <Avatar.Image
                            key={member._id}
                            source={{ uri: avatar }}
                            size={36}
                            style={[
                                styles.memberAvatar,
                                { marginLeft: index > 0 ? -10 : 0 },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    // Render circular progress indicator
    const renderCircularProgress = (progress: number): JSX.Element => {
        const percentage = Math.round(progress * 100);
        const size = 80;
        const strokeWidth = 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = circumference - (progress * circumference);

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

                    {/* Progress Circle */}
                    <View style={[
                        styles.circleProgress,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            transform: [{ rotateZ: '-90deg' }]
                        } as ViewStyle,
                        {
                            borderColor: '#6c5ce7',
                            borderLeftColor: 'transparent',
                            borderBottomColor: 'transparent',
                        } as ViewStyle,
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
    const renderTaskItem = ({ item }: { item: { id: number; title: string; completed: boolean; date: string } }) => (
        <View style={[styles.taskItem, item.completed ? styles.completedTaskItem : styles.pendingTaskItem]}>
            <View style={styles.taskIconContainer}>
                {item.completed ? (
                    <View style={styles.completedCheckCircle}>
                        <Icon name="check" size={14} color="#fff" />
                    </View>
                ) : (
                        <View style={styles.pendingCircle} />
                )}
            </View>
            <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <View style={styles.taskDateContainer}>
                    <Icon name="clock" size={12} color="#999" style={styles.clockIcon} />
                    <Text style={styles.taskDate}>{item.date}</Text>
                </View>
            </View>
        </View>
    );

    // Render loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6c5ce7" />
                <Text style={styles.loadingText}>Loading project details...</Text>
            </View>
        );
    }

    // Render error state
    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={48} color="#FF6B6B" />
                <Text style={styles.errorText}>Failed to load project details</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'No date set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

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
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="more-vertical" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Main content (not scrollable) */}
            <View style={styles.mainContent}>
                {/* Project Title */}
                <Text style={styles.projectTitle}>{project?.name || 'Untitled Project'}</Text>

                {/* Project Details Cards */}
                <View style={styles.detailsCards}>
                    <View style={styles.detailCard}>
                        <View style={[styles.cardIconContainer, { backgroundColor: project?.color || '#6c5ce7' }]}>
                            <Icon name="calendar" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardLabel}>Due Date</Text>
                            <Text style={styles.cardValue}>{formatDate(project?.endDate)}</Text>
                        </View>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={[styles.cardIconContainer, { backgroundColor: project?.color || '#6c5ce7' }]}>
                            <Icon name="users" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardLabel}>Project Team</Text>
                            {renderTeamMembers()}
                        </View>
                    </View>
                </View>

                {/* Project Description */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Project Details</Text>
                    <Text style={styles.projectDescription}>
                        {project?.description || 'No description available'}
                    </Text>
                </View>


                {/* Tasks List Title with Add Task Button */}
                <View style={styles.taskTitleContainer}>
                    <Text style={styles.sectionTitle}>All Tasks</Text>
                    <TouchableOpacity style={styles.addSubtaskButton}>
                        <Text style={styles.addSubtaskText}>Add task</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tasks List as its own section with FlatList */}
            <View style={styles.taskListContainer}>
                {tasks.length > 0 ? (
                    <FlatList
                        data={tasks}
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

            {/* Removed the fixed Add Task Button */}
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
    actionButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
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
        color: '#333',
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
        fontSize: 16,
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
    statusLabel: {
        fontSize: 16,
        color: '#333333',
    },
    statusValue: {
        textTransform: 'capitalize',
        fontWeight: '500',
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
    taskTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addSubtaskButton: {
        backgroundColor: '#6c5ce7',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    addSubtaskText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    taskListContainer: {
        flex: 1,
        paddingHorizontal: 20,
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0', // Light gray border
        marginBottom: 10,


    },
    completedTaskItem: {
        // backgroundColor: '#f0f9ff',
        backgroundColor: '#d4cfff',
    // backgroundColor: '#e8e6fa',
    },
    pendingTaskItem: {
        backgroundColor: '#fff9f0',
    },
    taskIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    completedCheckCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pendingCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#999',
        backgroundColor: 'transparent',
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    taskDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clockIcon: {
        marginRight: 4,
    },
    taskDate: {
        fontSize: 12,
        color: '#999',
    },
    noTasksContainer: {
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTasksText: {
        fontSize: 16,
        color: '#999999',
        fontStyle: 'italic',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666666',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#6c5ce7',
        borderRadius: 8,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
});

export default ProjectDetailScreen;
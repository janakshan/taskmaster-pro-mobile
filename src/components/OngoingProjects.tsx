// src/components/OngoingProjects.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Project, useGetOngoingProjectsQuery } from 'src/store/slices/api/projectsApi';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface OngoingProjectsProps {
    onSeeAllPress: () => void;
}

const OngoingProjects: React.FC<OngoingProjectsProps> = ({ onSeeAllPress }) => {
    const {
        data: allProjects = [],
        isLoading,
        error
    } = useGetOngoingProjectsQuery();

    const projects = allProjects.slice(-2);

    const navigation = useNavigation<NavigationProp>();

    // Render team members avatars with overlap effect
    const renderTeamMembers = (project: Project) => {
        const visibleMembers = project.members.slice(0, 4); // Show only first 4 members
        const remainingCount = project.members.length - 4;

        return (
            <View style={styles.teamMembersContainer}>
                {visibleMembers.map((member, index) => {
                    // Use owner avatar as fallback
                    const avatarUrl = member.user?.avatar || project.owner.avatar || 'https://randomuser.me/api/portraits/men/1.jpg';

                    return (
                        <Avatar.Image
                            key={member._id}
                            source={{ uri: avatarUrl }}
                            size={30}
                            style={[
                                styles.memberAvatar,
                                { marginLeft: index > 0 ? -12 : 0 },
                            ]}
                        />
                    );
                })}

                {remainingCount > 0 && (
                    <View style={styles.remainingMembersContainer}>
                        <Text style={styles.remainingMembersText}>+{remainingCount}</Text>
                    </View>
                )}
            </View>
        );
    };

    // Calculate and render progress circle for ongoing projects
    const renderProgressCircle = (project: Project) => {
        // Calculate progress based on completed tasks vs total tasks logic would go here
        // For simplicity, using a fixed progress value (could be enhanced with task data)
        const progress = 0.5; // 50% progress
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

    // Navigate to create project screen
    const handleCreateProjectPress = () => {
        // Replace with actual navigation to create project screen
        // navigation.navigate('CreateProject');
        console.log('Navigate to create project screen');
    };

    // Handle project card press - navigate to project details with projectId
    const handleProjectPress = (project: Project) => {
        // Navigate to project detail screen with projectId
        navigation.navigate('ProjectDetail', { projectId: project.id });
    };

    // Render loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading ongoing projects...</Text>
            </View>
        );
    }

    // Render error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error loading projects. Please try again.</Text>
                <TouchableOpacity style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Render empty state for ongoing projects
    const renderEmptyOngoingProjects = () => (
        <Card style={styles.emptyProjectCard}>
            <Card.Content style={styles.emptyProjectCardContent}>
                <Icon name="folder" size={40} color="#d0d0d0" />
                <Text style={styles.emptyStateText}>No ongoing projects found</Text>
                <TouchableOpacity
                    style={styles.createProjectButton}
                    onPress={handleCreateProjectPress}
                >
                    <Text style={styles.createProjectButtonText}>Create Project</Text>
                </TouchableOpacity>
            </Card.Content>
        </Card>
    );

    return (
        <>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ongoing Projects</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            {/* List of Ongoing Projects */}
            {projects.length > 0 ? (
                projects.map((project) => (
                    <TouchableOpacity
                        key={project.id}
                        onPress={() => handleProjectPress(project)}
                        activeOpacity={0.7}
                    >
                        <Card style={[styles.ongoingProjectCard, { backgroundColor: project.color || '#FFE6C9' }]}>
                            <Card.Content style={styles.projectCardContent}>
                                <View style={styles.projectMainInfo}>
                                    <View>
                                        <Text style={styles.projectTitle}>{project.name}</Text>
                                        <Text style={styles.teamMembersLabel}>Team members</Text>
                                        {renderTeamMembers(project)}
                                        <Text style={styles.dueDate}>
                                            Due on: {new Date(project.endDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                    <View style={styles.iconContainer}>
                                        <Icon name={project.icon || "folder"} size={24} color="#FFFFFF" />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))
            ) : (
                renderEmptyOngoingProjects()
            )}
        </>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: 20,
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
    ongoingProjectCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 12,
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
    emptyProjectCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    emptyProjectCardContent: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 180,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginTop: 12,
    },
    createProjectButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#6c5ce7',
        borderRadius: 8,
    },
    createProjectButtonText: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: 14,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    retryButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#6c5ce7',
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontWeight: '500',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(76, 74, 74, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
});

export default OngoingProjects;
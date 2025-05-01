import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
type ProjectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface OngoingProjectsProps {
    projects: Project[];
    onSeeAllPress: () => void;
}

const OngoingProjects: React.FC<OngoingProjectsProps> = ({ projects, onSeeAllPress }) => {
    const navigation = useNavigation<ProjectScreenNavigationProp>();

    // Render team members avatars with overlap effect
    const renderTeamMembers = (members: TeamMember[]) => {
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
    const renderProgressCircle = (progress: number) => {
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

    // Handle project card press - navigate to project details
    const handleProjectPress = (project: Project) => {
        navigation.navigate('ProjectDetail', { project });
    };

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
                        <Card style={styles.ongoingProjectCard}>
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
});

export default OngoingProjects;
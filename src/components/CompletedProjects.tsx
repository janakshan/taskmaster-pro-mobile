// src/components/CompletedProjects.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Project, useGetCompletedProjectsQuery } from 'src/store/slices/api/projectsApi';

interface CompletedProjectsProps {
    onSeeAllPress: () => void;
}

const CompletedProjects: React.FC<CompletedProjectsProps> = ({ onSeeAllPress }) => {
    const { data: allProjects = [], isLoading, error } = useGetCompletedProjectsQuery();
    const navigation = useNavigation();

    // Only show the last 5 projects
    const projects = allProjects.slice(-5);

    // Handle project press - navigate to details
    const handleProjectPress = (project: Project) => {
        // Type this properly when implementing navigation
        // navigation.navigate('ProjectDetail', { project });
        console.log('Navigate to project details:', project.id);
    };

    // Render team members avatars with overlap effect
    const renderMembers = (project: Project) => {
        const maxVisibleMembers = 3;
        const visibleMembers = project.members.slice(0, maxVisibleMembers);
        const remainingCount = project.members.length - maxVisibleMembers;

        return (
            <View style={styles.membersContainer}>
                {visibleMembers.map((member, index) => {
                    // Use owner avatar as fallback
                    const avatarUrl = project.owner.avatar || 'https://randomuser.me/api/portraits/men/1.jpg';

                    return (
                        <Avatar.Image
                            key={member._id}
                            source={{ uri: avatarUrl }}
                            size={24}
                            style={[
                                styles.memberAvatar,
                                { marginLeft: index > 0 ? -8 : 0 },
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

    // Handle loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading completed projects...</Text>
            </View>
        );
    }

    // Handle error state
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

    // Handle empty state
    if (projects.length === 0) {
        return (
            <>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Completed Projects</Text>
                    <TouchableOpacity onPress={onSeeAllPress}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyContainer}>
                    <Icon name="check-circle" size={40} color="#d0d0d0" />
                    <Text style={styles.emptyText}>No completed projects yet</Text>
                </View>
            </>
        );
    }

    return (
        <>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Completed Projects</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {projects.map((project) => (
                    <TouchableOpacity
                        key={project.id}
                        onPress={() => handleProjectPress(project)}
                        activeOpacity={0.7}
                    >
                        <Card style={styles.completedProjectCard}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Icon name={project.icon || "check-circle"} size={20} color="#ffffff" />
                                </View>
                                <Text style={styles.projectTitle}>{project.name}</Text>
                                <Text style={styles.projectDescription} numberOfLines={2}>
                                    {project.description}
                                </Text>
                                {renderMembers(project)}
                                <View style={styles.completedBadge}>
                                    <Text style={styles.completedText}>100%</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    scrollContent: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    completedProjectCard: {
        width: 200,
        marginRight: 15,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: '#5F33E1'
    },
    cardContent: {
        padding: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    projectDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 15,
    },
    membersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberAvatar: {
        borderWidth: 1.5,
        borderColor: '#ffffff',
    },
    remainingMembersContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
        borderWidth: 1.5,
        borderColor: '#ffffff',
    },
    remainingMembersText: {
        fontSize: 10,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    completedBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    completedText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 'bold',
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 15,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#757575',
    },
});

export default CompletedProjects;
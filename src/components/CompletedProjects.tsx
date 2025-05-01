import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

// Types
type TeamMember = {
    id: number;
    avatar: string;
};

type CompletedTask = {
    id: number;
    title: string;
    teamMembers: TeamMember[];
    progress: number;
    color: string;
};

interface CompletedProjectsProps {
    tasks: CompletedTask[];
    onSeeAllPress: () => void;
}

const CompletedProjects: React.FC<CompletedProjectsProps> = ({ tasks, onSeeAllPress }) => {
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

    // Render empty state for completed tasks
    const renderEmptyCompletedTasks = () => (
        <View style={styles.emptyCompletedTaskCard}>
            <Icon name="check-circle" size={40} color="#d0d0d0" />
            <Text style={styles.emptyStateText}>No completed tasks yet</Text>
        </View>
    );

    return (
        <>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Completed Tasks</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            {/* Horizontal Scroll for Completed Tasks */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
            >
                {tasks.length > 0 ? (
                    tasks.map((task) => (
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
                    ))
                ) : (
                    renderEmptyCompletedTasks()
                )}
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
    emptyCompletedTaskCard: {
        width: 240,
        height: 180,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginTop: 12,
    },
});

export default CompletedProjects;
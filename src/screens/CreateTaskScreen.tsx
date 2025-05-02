import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CreateTaskScreen = ({ route }) => {
    const navigation = useNavigation();
    const { projectId } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [teamMembers, setTeamMembers] = useState([
        { id: '1', name: 'Robert', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { id: '2', name: 'Sophia', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }
    ]);
    const [time, setTime] = useState('10:30 AM');
    const [date, setDate] = useState('15/11/2022');

    const handleCreateTask = () => {
        // Here you would typically call your API to create the task
        console.log('Creating task:', { title, description, teamMembers, time, date, projectId });

        // Navigate back after creation
        navigation.goBack();
    };

    const removeMember = (id) => {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create New Task</Text>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Task Title */}
                <Text style={styles.label}>Task Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter task title"
                />

                {/* Task Details */}
                <Text style={styles.label}>Task Details</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter task description"
                    multiline
                    numberOfLines={4}
                />

                {/* Team Members */}
                <Text style={styles.label}>Add team members</Text>
                <View style={styles.teamContainer}>
                    {teamMembers.map(member => (
                        <View key={member.id} style={styles.memberChip}>
                            <Avatar.Image source={{ uri: member.avatar }} size={24} />
                            <Text style={styles.memberName}>{member.name}</Text>
                            <TouchableOpacity onPress={() => removeMember(member.id)}>
                                <Icon name="x" size={16} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton}>
                        <Icon name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Time and Date */}
                <View style={styles.timeAndDateContainer}>
                    <View style={styles.timeContainer}>
                        <View style={styles.iconContainer}>
                            <Icon name="clock" size={24} color="#fff" />
                        </View>
                        <TextInput
                            style={styles.timeInput}
                            value={time}
                            onChangeText={setTime}
                            placeholder="Time"
                        />
                    </View>

                    <View style={styles.dateContainer}>
                        <View style={styles.iconContainer}>
                            <Icon name="calendar" size={24} color="#fff" />
                        </View>
                        <TextInput
                            style={styles.dateInput}
                            value={date}
                            onChangeText={setDate}
                            placeholder="Date"
                        />
                    </View>
                </View>

                {/* Add New Button */}
                {/* <TouchableOpacity style={styles.addNewButton}>
                    <Text style={styles.addNewText}>Add New</Text>
                </TouchableOpacity> */}

                {/* Create Button */}
                <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginLeft: 16,
    },
    formContainer: {
        padding: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    teamContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 16,
    },
    memberChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    memberName: {
        marginHorizontal: 8,
        fontSize: 14,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeAndDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    timeContainer: {
        flexDirection: 'row',
        width: '48%',
    },
    dateContainer: {
        flexDirection: 'row',
        width: '48%',
    },
    iconContainer: {
        width: 48,
        height: 56,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    timeInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        padding: 12,
        fontSize: 16,
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        padding: 12,
        fontSize: 16,
    },
    addNewButton: {
        alignItems: 'center',
        padding: 16,
        marginBottom: 24,
    },
    addNewText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    createButton: {
        backgroundColor: '#6c5ce7',
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 32,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CreateTaskScreen;
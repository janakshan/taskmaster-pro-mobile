import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useCreateTaskMutation } from 'src/store/slices/api/taskApi';
import TaskForm from '../components/TaskForm';

// Define the form data type
type TaskFormData = {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: Date;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
};

const CreateTaskScreen = ({ route }) => {
    const navigation = useNavigation();
    // Extract projectId from route params
    const { projectId } = route.params || {};

    // RTK Query hook for creating a task
    const [createTask, { isLoading }] = useCreateTaskMutation();

    // Handle form submission
    const handleCreateTask = async (formData: TaskFormData) => {
        if (!projectId) {
            Alert.alert('Error', 'Project ID is required to create a task');
            return;
        }

        try {
            // Prepare task data for API
            const taskData = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                // Map 'urgent' to 'high' as our API only accepts low/medium/high
                priority: formData.priority === 'urgent' ? 'high' : formData.priority,
                dueDate: formData.dueDate.toISOString(),
                project: projectId,
                // Other fields can be added as needed
            };

            // Call the API
            const response = await createTask(taskData).unwrap();

            // Show success message
            Alert.alert(
                "Success",
                "Task created successfully!",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            // Handle API errors
            console.error('Failed to create task:', error);

            let errorMessage = "Failed to create task. Please try again.";

            // Extract error message from API response if available
            if (error.data?.message) {
                errorMessage = error.data.message;
            }

            Alert.alert("Error", errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create New Task</Text>
                </View>
            </SafeAreaView>

            {/* Task Form Component */}
            <TaskForm
                onSubmit={handleCreateTask}
                isLoading={isLoading}
                projectId={projectId}
                submitButtonText="Create Task"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    safeAreaView: {
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
});

export default CreateTaskScreen;
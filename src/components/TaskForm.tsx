import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Icon from 'react-native-vector-icons/Feather';
import { Avatar, TextInput } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

// Form validation schema with Zod
const taskSchema = z.object({
    title: z.string()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(100, { message: 'Title must be less than 100 characters' }),
    description: z.string()
        .max(500, { message: 'Description must be less than 500 characters' })
        .optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    dueDate: z.date(),
    status: z.enum(['todo', 'in_progress', 'review', 'completed']),
});

// Type inferred from the schema
type TaskFormData = z.infer<typeof taskSchema>;

// Props for the component
interface TaskFormProps {
    initialData?: Partial<TaskFormData>;
    onSubmit: (data: TaskFormData) => Promise<void>;
    isLoading: boolean;
    projectId: string;
    submitButtonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    projectId,
    submitButtonText = 'Create Task'
}) => {
    // Setup react-hook-form with zod validation
    const { control, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            priority: initialData?.priority || 'medium',
            dueDate: initialData?.dueDate || new Date(),
            status: initialData?.status || 'todo',
        }
    });

    // State for date picker visibility
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // State for team members (demo data - replace with API data)
    const [teamMembers, setTeamMembers] = useState([
        { id: '1', name: 'Robert', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { id: '2', name: 'Sophia', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    ]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const removeMember = (id) => {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
    };

    const getPriorityColor = (level, isSelected) => {
        if (!isSelected) return 'transparent';

        switch (level) {
            case 'low': return '#4dabf7';
            case 'medium': return '#ffa94d';
            case 'high': return '#ff6b6b';
            case 'urgent': return '#e03131';
            default: return '#6c5ce7';
        }
    };

    return (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Task Title */}
            <Text style={styles.label}>Task Title<Text style={styles.required}>*</Text></Text>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter task title"
                        error={!!errors.title}
                    />
                )}
                name="title"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

            {/* Task Details */}
            <Text style={styles.label}>Task Details</Text>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter task description"
                        multiline
                        numberOfLines={4}
                        error={!!errors.description}
                    />
                )}
                name="description"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

            {/* Team Members */}
            <Text style={styles.label}>Add team members</Text>
            <View style={styles.teamContainer}>
                {teamMembers.map(member => (
                    <View key={member.id} style={styles.memberChip}>
                        <Avatar.Image source={{ uri: member.avatar }} size={24} />
                        <Text style={styles.memberName}>{member.name}</Text>
                        <TouchableOpacity onPress={() => removeMember(member.id)}>
                            <Icon name="x" size={16} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addButton}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Priority Selection */}
            <Text style={styles.label}>Priority</Text>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.priorityContainer}>
                        {['low', 'medium', 'high', 'urgent'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.priorityButton,
                                    value === level && styles.priorityButtonSelected,
                                    { backgroundColor: getPriorityColor(level, value === level) }
                                ]}
                                onPress={() => onChange(level)}
                            >
                                <Text style={[
                                    styles.priorityButtonText,
                                    value === level && styles.priorityButtonTextSelected
                                ]}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                name="priority"
            />

            {/* Due Date */}
            <Text style={styles.label}>Due Date<Text style={styles.required}>*</Text></Text>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={showDatePicker}
                        >
                            <Icon name="calendar" size={20} color="#6c5ce7" style={styles.dateIcon} />
                            <Text style={styles.dateText}>
                                {format(value, 'PPP')} at {format(value, 'p')}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="datetime"
                            onConfirm={(date) => {
                                onChange(date);
                                hideDatePicker();
                            }}
                            onCancel={hideDatePicker}
                            date={value}
                        />
                    </View>
                )}
                name="dueDate"
            />
            {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate.message}</Text>}

            {/* Status selection (hidden in create mode, shown in edit mode) */}
            {initialData?.status && (
                <>
                    <Text style={styles.label}>Status</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.statusContainer}>
                                {['todo', 'in_progress', 'review', 'completed'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.statusButton,
                                            value === status && styles.statusButtonSelected,
                                        ]}
                                        onPress={() => onChange(status)}
                                    >
                                        <Text style={[
                                            styles.statusButtonText,
                                            value === status && styles.statusButtonTextSelected
                                        ]}>
                                            {status === 'in_progress'
                                                ? 'In Progress'
                                                : status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        name="status"
                    />
                </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>{submitButtonText}</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    required: {
        color: '#ff6b6b',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
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
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    memberName: {
        marginHorizontal: 8,
        fontSize: 14,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    priorityButton: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    priorityButtonSelected: {
        borderColor: 'transparent',
    },
    priorityButtonText: {
        fontSize: 14,
        color: '#333',
        textTransform: 'capitalize',
    },
    priorityButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statusButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flex: 1,
        marginHorizontal: 4,
        marginBottom: 8,
        alignItems: 'center',
    },
    statusButtonSelected: {
        backgroundColor: '#6c5ce7',
        borderColor: 'transparent',
    },
    statusButtonText: {
        fontSize: 14,
        color: '#333',
    },
    statusButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    dateIcon: {
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#6c5ce7',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 32,
    },
    submitButtonDisabled: {
        backgroundColor: '#a29ddb',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default TaskForm;
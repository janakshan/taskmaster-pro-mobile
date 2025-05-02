import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from 'src/config';
import { RootState } from 'src/store';

// Types
export interface Assignee {
    user: {
        _id: string;
        name: string;
        avatar: string | null;
        id: string;
    };
    role: string;
    _id: string;
    id: string;
}

export interface TaskProject {
    _id: string;
    name: string;
    color: string | null;
    icon: string;
    id: string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    user: string;
    project: TaskProject;
    assignees: Assignee[];
    category: string | null;
    tags: string[];
    parent: string | null;
    estimatedTime: number;
    actualTime: number;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    id: string;
}

export interface TasksResponse {
    success: boolean;
    count?: number;
    data: Task[];
}

export interface TaskResponse {
    success: boolean;
    data: Task;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'review' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    project: string;
    category?: string;
    tags?: string[];
    parent?: string;
}

export interface UpdateTaskRequest {
    status?: 'todo' | 'in_progress' | 'review' | 'completed';
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    [key: string]: any; // For other fields
}

// Create API slice
export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers, { getState }) => {
            // Get token from auth state
            const token = (getState() as RootState).auth.token;

            // If we have a token, add it to request headers
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Task', 'ProjectTasks'],
    endpoints: (builder) => ({
        // Get tasks by project ID
        getTasksByProjectId: builder.query<Task[], string>({
            query: (projectId) => `/projects/${projectId}/tasks`,
            transformResponse: (response: TasksResponse) => response.data,
            providesTags: (result, error, projectId) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Task' as const, id })),
                        { type: 'ProjectTasks', id: projectId },
                    ]
                    : [{ type: 'ProjectTasks', id: projectId }],
        }),
        // Get task by ID
        getTaskById: builder.query<Task, string>({
            query: (id) => `/tasks/${id}`,
            transformResponse: (response: TaskResponse) => response.data,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),
        // Update task
        updateTask: builder.mutation<Task, { taskId: string; data: UpdateTaskRequest }>({
            query: ({ taskId, data }) => ({
                url: `/tasks/${taskId}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: TaskResponse) => response.data,
            invalidatesTags: (result, error, { taskId }) =>
                error ? [] : [
                    { type: 'Task', id: taskId },
                    { type: 'ProjectTasks', id: result?.project?._id }
                ],
        }),
        // Create new task
        createTask: builder.mutation<TaskResponse, CreateTaskRequest>({
            query: (taskData) => ({
                url: '/tasks',
                method: 'POST',
                body: taskData,
            }),
            invalidatesTags: (result) =>
                result?.success ? [
                    { type: 'Task', id: result.data.id },
                    { type: 'ProjectTasks', id: result.data.project._id }
                ] : [],
        }),
    }),
});

// Export hooks
export const {
    useGetTasksByProjectIdQuery,
    useGetTaskByIdQuery,
    useUpdateTaskMutation,
    useCreateTaskMutation
} = tasksApi;
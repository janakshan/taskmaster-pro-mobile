import axios from 'axios';
import { API_URL, ERROR_MESSAGES } from '../config';
import { authService } from './authService';
import {
    Task,
    UpdateTaskRequest,
    CreateTaskRequest
} from 'src/store/slices/api/taskApi';

class TaskService {
    /**
     * Get tasks for a specific project
     */
    async getTasksByProjectId(projectId: string): Promise<Task[]> {
        try {
            const credentials = await authService.loadStoredCredentials();

            if (!credentials?.token) {
                throw new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
            }

            const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, {
                headers: {
                    Authorization: `Bearer ${credentials.token}`
                }
            });

            const { success, data } = response.data;

            if (!success) {
                throw new Error(ERROR_MESSAGES.DATA_FETCH_FAILED);
            }

            return data;
        } catch (error) {
            console.error('Tasks fetch error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const credentials = await authService.loadStoredCredentials();
                        if (credentials?.refreshToken) {
                            await authService.refreshAuthToken(credentials.refreshToken);
                            // Retry the request after token refresh
                            return this.getTasksByProjectId(projectId);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
                    }
                }
                throw new Error(error.response?.data?.message || ERROR_MESSAGES.DATA_FETCH_FAILED);
            }
            throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    /**
     * Create a new task
     */
    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        try {
            const credentials = await authService.loadStoredCredentials();

            if (!credentials?.token) {
                throw new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
            }

            const response = await axios.post(
                `${API_URL}/tasks`,
                taskData,
                {
                    headers: {
                        Authorization: `Bearer ${credentials.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { success, data } = response.data;

            if (!success) {
                throw new Error(ERROR_MESSAGES.CREATION_FAILED);
            }

            return data;
        } catch (error) {
            console.error('Task creation error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const credentials = await authService.loadStoredCredentials();
                        if (credentials?.refreshToken) {
                            await authService.refreshAuthToken(credentials.refreshToken);
                            // Retry the request after token refresh
                            return this.createTask(taskData);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
                    }
                }
                throw new Error(error.response?.data?.message || ERROR_MESSAGES.CREATION_FAILED);
            }
            throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    /**
     * Update a task
     */
    async updateTask(taskId: string, updateData: UpdateTaskRequest): Promise<Task> {
        try {
            const credentials = await authService.loadStoredCredentials();

            if (!credentials?.token) {
                throw new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
            }

            const response = await axios.patch(
                `${API_URL}/tasks/${taskId}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${credentials.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { success, data } = response.data;

            if (!success) {
                throw new Error(ERROR_MESSAGES.UPDATE_FAILED);
            }

            return data;
        } catch (error) {
            console.error('Task update error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const credentials = await authService.loadStoredCredentials();
                        if (credentials?.refreshToken) {
                            await authService.refreshAuthToken(credentials.refreshToken);
                            // Retry the request after token refresh
                            return this.updateTask(taskId, updateData);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
                    }
                }
                throw new Error(error.response?.data?.message || ERROR_MESSAGES.UPDATE_FAILED);
            }
            throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    /**
     * Toggle task completion status
     */
    async toggleTaskCompletion(taskId: string, currentStatus: string): Promise<Task> {
        const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
        return this.updateTask(taskId, { status: newStatus });
    }

    /**
     * Delete a task
     */
    async deleteTask(taskId: string): Promise<boolean> {
        try {
            const credentials = await authService.loadStoredCredentials();

            if (!credentials?.token) {
                throw new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
            }

            const response = await axios.delete(
                `${API_URL}/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${credentials.token}`
                    }
                }
            );

            const { success } = response.data;

            if (!success) {
                throw new Error(ERROR_MESSAGES.DELETE_FAILED);
            }

            return true;
        } catch (error) {
            console.error('Task deletion error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const credentials = await authService.loadStoredCredentials();
                        if (credentials?.refreshToken) {
                            await authService.refreshAuthToken(credentials.refreshToken);
                            // Retry the request after token refresh
                            return this.deleteTask(taskId);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
                    }
                }
                throw new Error(error.response?.data?.message || ERROR_MESSAGES.DELETE_FAILED);
            }
            throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }
}

export const taskService = new TaskService();
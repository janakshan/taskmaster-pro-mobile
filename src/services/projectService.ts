// src/services/projectService.ts
import axios from 'axios';
import { API_URL, ERROR_MESSAGES } from '../config';
import { authService } from './authService';
import { Project } from 'src/store/slices/api/projectsApi';

class ProjectService {
    /**
     * Get projects with specified status
     */
    async getProjects(status?: 'completed' | 'ongoing' | 'pending'): Promise<Project[]> {
        try {
            const credentials = await authService.loadStoredCredentials();

            if (!credentials?.token) {
                throw new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
            }

            const url = status
                ? `${API_URL}/projects?status=${status}`
                : `${API_URL}/projects`;

            const response = await axios.get(url, {
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
            console.error('Project fetch error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const credentials = await authService.loadStoredCredentials();
                        if (credentials?.refreshToken) {
                            await authService.refreshAuthToken(credentials.refreshToken);
                            // Retry the request after token refresh
                            return this.getProjects(status);
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
     * Get completed projects
     */
    async getCompletedProjects(): Promise<Project[]> {
        return this.getProjects('completed');
    }

    /**
     * Get ongoing projects
     */
    async getOngoingProjects(): Promise<Project[]> {
        return this.getProjects('ongoing');
    }
}

export const projectService = new ProjectService();
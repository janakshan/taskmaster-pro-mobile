import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './store';
import { logout, refreshToken } from './store/slices/authSlice';
import { API_URL, STORAGE_KEYS } from './config';

// Create axios instance
const httpClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add auth token
httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Get token from storage
        const token = await AsyncStorage.getItem(`${STORAGE_KEYS.AUTH_PREFIX}token`);

        // If token exists, add to headers
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from storage
                const currentRefreshToken = await AsyncStorage.getItem(`${STORAGE_KEYS.AUTH_PREFIX}refresh_token`);

                if (!currentRefreshToken) {
                    // No refresh token, force logout
                    store.dispatch(logout());
                    return Promise.reject(error);
                }

                // Try to refresh the token
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken: currentRefreshToken
                });

                // Update tokens in Redux and storage
                const { token, refreshToken: newRefreshToken } = response.data;
                store.dispatch(refreshToken({ token, refreshToken: newRefreshToken }));

                // Update the header and retry the original request
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return httpClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default httpClient;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { API_URL, STORAGE_KEYS, ERROR_MESSAGES } from '../config';

// Storage keys
const AUTH_TOKEN_KEY = `${STORAGE_KEYS.AUTH_PREFIX}token`;
const AUTH_REFRESH_TOKEN_KEY = `${STORAGE_KEYS.AUTH_PREFIX}refresh_token`;
const AUTH_USER_KEY = `${STORAGE_KEYS.AUTH_PREFIX}user`;

class AuthService {
    /**
     * Login user and get tokens
     */
    async login(email: string, password: string): Promise<AuthCredentials> {
        try {
            // Call your API endpoint
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            console.log('API response:', response.data);

            // Extract data from response with the correct structure
            const { success, data } = response.data;

            if (!success) {
                throw new Error(ERROR_MESSAGES.AUTHENTICATION_FAILED);
            }

            // Create credentials object
            const credentials: AuthCredentials = {
                token: data.token,
                refreshToken: data.refreshToken,
                user: {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar || null,
                    role: data.role || 'user'
                }
            };

            // Save credentials to storage
            await this.saveCredentials(credentials);

            return credentials;
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    throw new Error(error.response.data.message || ERROR_MESSAGES.AUTHENTICATION_FAILED);
                } else if (error.request) {
                    // The request was made but no response was received
                    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
                }
            }
            // Something happened in setting up the request that triggered an Error
            throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    /**
     * Register a new user
     */
    async register(name: string, email: string, password: string): Promise<AuthCredentials> {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password
            });

            // Extract data from response with the correct structure
            const { success, data } = response.data;

            if (!success) {
                throw new Error('Registration failed');
            }

            // Create credentials object
            const credentials: AuthCredentials = {
                token: data.token,
                refreshToken: data.refreshToken,
                user: {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar || null,
                    role: data.role || 'user'
                }
            };

            // Save credentials to storage
            await this.saveCredentials(credentials);

            return credentials;
        } catch (error) {
            console.error('Registration error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Registration failed');
                } else if (error.request) {
                    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
                }
            }
            throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

            // Call logout endpoint if you have one
            if (token) {
                await axios.post(`${API_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with local logout even if API call fails
        }

        // Always clear stored credentials
        await this.clearCredentials();
    }

    /**
     * Refresh the authentication token
     */
    async refreshAuthToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
        try {
            const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken;

            // Update stored tokens
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
            await AsyncStorage.setItem(AUTH_REFRESH_TOKEN_KEY, newRefreshToken);

            return {
                token: newToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            console.error('Token refresh error:', error);
            // If refresh fails, force logout
            await this.clearCredentials();
            throw new Error('Session expired. Please login again.');
        }
    }

    /**
     * Save user credentials to storage
     */
    async saveCredentials(credentials: AuthCredentials): Promise<void> {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, credentials.token);
        await AsyncStorage.setItem(AUTH_REFRESH_TOKEN_KEY, credentials.refreshToken);
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(credentials.user));
    }

    /**
     * Clear user credentials from storage
     */
    async clearCredentials(): Promise<void> {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(AUTH_USER_KEY);
    }

    /**
     * Load stored credentials
     */
    async loadStoredCredentials(): Promise<AuthCredentials | null> {
        try {
            const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
            const refreshToken = await AsyncStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
            const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);

            if (!token || !refreshToken || !userJson) {
                return null;
            }

            const user = JSON.parse(userJson);

            return {
                token,
                refreshToken,
                user,
            };
        } catch (error) {
            console.error('Error loading stored credentials:', error);
            return null;
        }
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        const credentials = await this.loadStoredCredentials();
        return !!credentials?.token;
    }
}

export const authService = new AuthService();
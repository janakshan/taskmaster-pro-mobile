import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define base API URL - you'll want to use your actual API endpoint
const BASE_URL = 'https://api.taskmasterpro.com/v1';

// Define types for auth requests and responses
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
    isVerified: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

// Create the API service
export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            // Get the token from the auth state
            const token = (getState() as any).auth.token;

            // If we have a token, add it to the request headers
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),

        // Register endpoint
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        // Forgot password endpoint
        forgotPassword: builder.mutation<{ success: boolean }, { email: string }>({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),

        // Get current user info
        getCurrentUser: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

        // Logout endpoint
        logout: builder.mutation<{ success: boolean }, { refreshToken: string }>({
            query: (data) => ({
                url: '/auth/logout',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

// Export the auto-generated hooks
export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
} = api;
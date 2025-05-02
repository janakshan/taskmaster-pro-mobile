// src/hooks/useApi.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCompletedProjectsQuery, useGetOngoingProjectsQuery } from '../store/api/projectsApi';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';

/**
 * Custom hook to handle global API states and errors
 */
export const useApiState = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Get states from different API queries
    const completedProjectsQuery = useGetCompletedProjectsQuery(undefined, {
        skip: !isAuthenticated
    });
    const ongoingProjectsQuery = useGetOngoingProjectsQuery(undefined, {
        skip: !isAuthenticated
    });

    // Check if any query has an authentication error
    const hasAuthError =
        completedProjectsQuery.error?.status === 401 ||
        ongoingProjectsQuery.error?.status === 401;

    // Handle authentication errors globally
    useEffect(() => {
        const handleAuthError = async () => {
            if (hasAuthError) {
                try {
                    // Try to refresh token
                    const credentials = await authService.loadStoredCredentials();
                    if (credentials?.refreshToken) {
                        await authService.refreshAuthToken(credentials.refreshToken);
                        // Retry queries after token refresh
                        if (completedProjectsQuery.error) completedProjectsQuery.refetch();
                        if (ongoingProjectsQuery.error) ongoingProjectsQuery.refetch();
                    } else {
                        // No refresh token, logout
                        dispatch(logout());
                    }
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    dispatch(logout());
                }
            }
        };

        if (hasAuthError) {
            handleAuthError();
        }
    }, [hasAuthError, dispatch]);

    return {
        isLoading:
            completedProjectsQuery.isLoading ||
            ongoingProjectsQuery.isLoading,
        hasErrors:
            !!completedProjectsQuery.error ||
            !!ongoingProjectsQuery.error,
        refetchAll: () => {
            completedProjectsQuery.refetch();
            ongoingProjectsQuery.refetch();
        }
    };
};

/**
 * Custom hook for authorization check with redirect capability
 */
export const useAuth = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await authService.logout();
        dispatch(logout());
    };

    return {
        isAuthenticated,
        user,
        logout: handleLogout
    };
};
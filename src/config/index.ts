// src/config/index.ts

// API configuration
export const API_URL = 'http://localhost:5000/api';

// Error messages
export const ERROR_MESSAGES = {
    // Authentication errors
    AUTHENTICATION_REQUIRED: 'Authentication is required to perform this action.',
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',

    // Data operation errors
    DATA_FETCH_FAILED: 'Failed to fetch data. Please try again later.',
    UPDATE_FAILED: 'Failed to update. Please try again later.',
    CREATION_FAILED: 'Failed to create. Please try again later.',
    DELETE_FAILED: 'Failed to delete. Please try again later.',

    // Network errors
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',

    // Generic error
    GENERIC_ERROR: 'Something went wrong. Please try again later.',
};

// Task status options
export const TASK_STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
];

// Task priority options
export const TASK_PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: '#4dabf7' },
    { value: 'medium', label: 'Medium', color: '#ffa94d' },
    { value: 'high', label: 'High', color: '#ff6b6b' },
    { value: 'urgent', label: 'Urgent', color: '#e03131' },
];

// Date format options
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    TIME: 'h:mm a',
    DATETIME: 'MMM dd, yyyy h:mm a',
    ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
};

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'taskmaster_auth_token',
    REFRESH_TOKEN: 'taskmaster_refresh_token',
    USER_DATA: 'taskmaster_user_data',
    APP_THEME: 'taskmaster_app_theme',
    APP_LANGUAGE: 'taskmaster_app_language',
};

// Theme configuration
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};
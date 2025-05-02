// src/config/index.ts

// API configuration
export const API_URL = 'http://192.168.1.150:5000/api';

// Storage keys
export const STORAGE_KEYS = {
    AUTH_PREFIX: '@ProjectApp_auth_',
    SETTINGS_PREFIX: '@ProjectApp_settings_',
    THEME_KEY: '@ProjectApp_theme',
};

// Error messages
export const ERROR_MESSAGES = {
    AUTHENTICATION_FAILED: 'Authentication failed. Please check your credentials and try again.',
    AUTHENTICATION_REQUIRED: 'Authentication required. Please login to continue.',
    NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again later.',
    DATA_FETCH_FAILED: 'Failed to fetch data. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
};

// App defaults
export const APP_DEFAULTS = {
    PAGINATION_LIMIT: 10,
    DEBOUNCE_DELAY: 500,
    ANIMATION_DURATION: 300,
};

// Project status options
export const PROJECT_STATUS = {
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    PENDING: 'pending',
};
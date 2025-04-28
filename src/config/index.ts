// API Configuration
// export const API_URL = 'http://localhost:5000/api';
export const API_URL = 'http://192.168.1.150:5000/api';

// Feature flags
export const FEATURES = {
    ENABLE_OFFLINE_MODE: true,
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_BIOMETRICS: true,
};

// Default app settings
export const SETTINGS = {
    THEME: 'light',
    LANGUAGE: 'en',
    NOTIFICATIONS_ENABLED: true,
};

// Storage keys
export const STORAGE_KEYS = {
    AUTH_PREFIX: 'taskmaster_auth_',
    SETTINGS_PREFIX: 'taskmaster_settings_',
    CACHED_DATA_PREFIX: 'taskmaster_cache_',
};

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    AUTHENTICATION_FAILED: 'Authentication failed. Please try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again later.',
};
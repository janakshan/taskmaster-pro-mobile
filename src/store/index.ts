import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Import other reducers as needed

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers here
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
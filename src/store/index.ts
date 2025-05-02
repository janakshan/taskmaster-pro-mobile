import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import { projectsApi } from './slices/api/projectsApi';
import { tasksApi } from './slices/api/taskApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            projectsApi.middleware,
            tasksApi.middleware
        ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
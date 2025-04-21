import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: string;
    } | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
};

export interface AuthCredentials {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: string;
    };
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthCredentials>) {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        updateUser(state, action: PayloadAction<Partial<AuthState['user']>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        refreshToken(state, action: PayloadAction<{ token: string; refreshToken: string }>) {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        },
        restoreCredentials(state, action: PayloadAction<AuthCredentials>) {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
    },
});

export const { login, logout, updateUser, refreshToken, restoreCredentials } = authSlice.actions;

export default authSlice.reducer;
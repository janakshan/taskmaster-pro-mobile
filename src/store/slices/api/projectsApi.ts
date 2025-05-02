// src/store/api/projectsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from 'src/config';
import { RootState } from 'src/store';


// Types
export interface Member {
    user: string;
    role: string;
    _id: string;
    joinedAt: string;
    id: string;
}

export interface Owner {
    _id: string;
    name: string;
    email: string;
    avatar: string | null;
    id: string;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
    startDate: string;
    endDate: string;
    status: 'completed' | 'ongoing' | 'pending';
    owner: Owner;
    members: Member[];
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}

export interface ProjectsResponse {
    success: boolean;
    count: number;
    data: Project[];
}

// Create API slice
export const projectsApi = createApi({
    reducerPath: 'projectsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers, { getState }) => {
            // Get token from auth state
            const token = (getState() as RootState).auth.token;

            // If we have a token, add it to request headers
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Project'],
    endpoints: (builder) => ({
        getCompletedProjects: builder.query<Project[], void>({
            query: () => '/projects?status=completed',
            transformResponse: (response: ProjectsResponse) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Project' as const, id })),
                        { type: 'Project', id: 'COMPLETED_LIST' },
                    ]
                    : [{ type: 'Project', id: 'COMPLETED_LIST' }],
        }),
        getOngoingProjects: builder.query<Project[], void>({
            query: () => '/projects?status=planning,active,on_hold',
            transformResponse: (response: ProjectsResponse) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Project' as const, id })),
                        { type: 'Project', id: 'ONGOING_LIST' },
                    ]
                    : [{ type: 'Project', id: 'ONGOING_LIST' }],
        }),
    }),
});

// Export hooks
export const {
    useGetCompletedProjectsQuery,
    useGetOngoingProjectsQuery,
} = projectsApi;
export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    ProjectDetail: {
        project: {
            id: number;
            title: string;
            teamMembers: Array<{
                id: number;
                avatar: string;
            }>;
            dueDate: string;
            progress: number;
            description: string;
            totalTasks: number;
            completedTasks: number;
            tasks: Array<{
                id: number;
                title: string;
                completed: boolean;
            }>;
        }
    };
};
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginDate: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

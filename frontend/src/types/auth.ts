export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export enum UserStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export interface User {
    id: string;
    name: string;
    shopName?: string;
    phoneNumber?: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    shopName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface UserStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export interface UserListItem extends User {
    // Extended interface for list display
}

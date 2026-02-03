export interface SignupRequest {
    username: string;
    fullName: string;
    email: string;
    password: string;
    department: string;
    role: string;
}

export interface SigninRequest {
    username: string;
    password: string;
}

export interface User {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

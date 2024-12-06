// src/app/models/user.model.ts
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    status: string; 
    emailConfirmed: boolean; 
    verificationToken?: string | null;
}

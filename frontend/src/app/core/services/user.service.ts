// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Import the User model
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = environment.apiUrl + 'Users';

    constructor(private http: HttpClient) { }

    // Get all users
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // Get a single user by ID
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    // Add a new user
    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    // Update an existing user
    updateUser(id: number, user: User): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, user);
    }

    // Delete a user
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Search users by name
    searchUsersByName(name: string): Observable<{ id: number, name: string }[]> {
        return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/search?name=${name}`);
    }

    // Lấy thông tin người dùng từ localStorage
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Kiểm tra người dùng có đăng nhập hay không
    isLoggedIn(): boolean {
        const token = localStorage.getItem('authToken');
        if (!token) return false;
    
        try {
            const decodedToken: any = jwtDecode(token);
            const expiry = decodedToken.exp * 1000; 
            if (expiry <= Date.now()) {
                // Token expired, remove from localStorage
                localStorage.removeItem('authToken');
                localStorage.removeItem('user'); 
                return false;
            }
            return true; 
        } catch (e) {
            console.error('Invalid token', e);
            // In case of an error, consider removing the invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return false;
        }
    }    
}

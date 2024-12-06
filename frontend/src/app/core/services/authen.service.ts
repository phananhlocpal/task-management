import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthenService {
    private apiUrl = `${environment.apiUrl}Authen`;

    constructor(private http: HttpClient) { }

    // Đăng ký người dùng
    signUp(signUpData: { name: string; email: string; password: string; role: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, signUpData);
    }

    // Đăng nhập người dùng
    login(loginData: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
            tap((response: any) => {
                // Giả sử response trả về bao gồm token và thông tin người dùng
                const token = response.token;
                const user = {
                    name: response.name,
                    email: response.email,
                    role: response.role,
                };

                // Lưu token và thông tin người dùng vào localStorage
                this.setToken(token);
                localStorage.setItem('user', JSON.stringify(user));  // Lưu thông tin người dùng

            })
        );
    }

    // Xác thực email người dùng
    verifyEmail(token: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/verifyemail`, {
            params: { token: token },
        });
    }

    // Đăng xuất người dùng
    logout(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        return this.http.post(`${this.apiUrl}/logout`, {}, { headers: headers });
    }

    // Lưu token JWT vào localStorage
    setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    // Lấy token JWT từ localStorage
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Xóa token JWT khỏi localStorage
    removeToken(): void {
        localStorage.removeItem('authToken');
    }
}

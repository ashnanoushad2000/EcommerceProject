import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService { 
  private baseUrl = 'http://localhost:3000/auth';  // ✅ Correct and clearly matches your backend

  constructor(private http: HttpClient) {}

  // 🔐 Clearly correct Login Method
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signin`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('isNewUser', res.isNewUser);
        localStorage.setItem('gift', res.gift || '');
      })
    );
  }
  

  // 🔑 Clearly added Signup Method (you were missing this)
  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  // 💾 Clearly correct method to save JWT token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // 📦 Clearly correct method to retrieve JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🚪 Clearly correct Logout method
  logout(): void {
    localStorage.removeItem('token');
  }
}

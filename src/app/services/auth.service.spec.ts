import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  // Updated signup method to accept a single user object
  signup(userData: {
    fullName: string,
    email: string,
    workCode: string,
    password: string,
    role: string
  }) {
    return this.http.post<{ message: string }>('/api/signup', userData);
  }

  // Login method (if needed)
  login(email: string, password: string) {
    return this.http.post<{ token: string }>('/api/login', { email, password });
  }
}
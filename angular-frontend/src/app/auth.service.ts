import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const data = {
      username: username,
      password: password
    };
    return this.http.post<any>(`${this.baseUrl}/login`, data);
  }

  register(username: string, email: string, password: string): Observable<any> {
    const data = {
      username: username,
      email: email,
      password: password
    };
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  // Function to validate email format
  validateEmail(email: string): boolean {
    // Regular expression to validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean{
    // Check if the password is at least 8 characters long
    return password.length >= 8;
  }
}


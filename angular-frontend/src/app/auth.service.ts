import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const data = {
      email: email,
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

  isLoggedIn(): Observable<boolean> {
    // Send a request to the backend to check if the user is logged in
    return this.http.get<any>(`${this.baseUrl}/is-logged-in`).pipe(
      map(response => response.loggedIn)
    );
  }

  getCurrentUser(): Observable<string> {
    // Send a request to the backend to get the username of the current user
    return this.http.get<any>(`${this.baseUrl}/is-logged-in`).pipe(
      map(response => response.username)
    );
  }

   getAuthToken(): string | null {
    // Retrieve the token from localStorage
    return localStorage.getItem('access_token');
  }
}


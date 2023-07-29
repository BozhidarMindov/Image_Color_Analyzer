import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, share} from 'rxjs';
import {Router} from "@angular/router";

interface UserInfoResponse {
  user_info: {
    username: string;
    email: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    const data = {
      email: email,
      password: password
    };
    return this.http.post<any>(`${this.baseUrl}/login`, data).pipe(
      share()
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const data = {
      username: username,
      email: email,
      password: password
    };
    return this.http.post<any>(`${this.baseUrl}/register`, data).pipe(
      share()
    );
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
    return this.http.get<any>(`${this.baseUrl}/is-logged-in`).pipe(
      map(response => response.loggedIn),
      catchError(() => of(false)),
      share()
    );
  }

  redirectToLogin(): void {
    // Handle token expiration or unauthorized access
    localStorage.removeItem('access_token');
    // Redirect to the login page
    this.router.navigate(['/login']);
  }

  getUserInformation(): Observable<UserInfoResponse> {
    return this.http.get<any>(`${this.baseUrl}/get-user-info`).pipe(
      share()
    );
  }

   getAuthToken(): string | null {
    // Retrieve the token from localStorage
    return localStorage.getItem('access_token');
  }
}


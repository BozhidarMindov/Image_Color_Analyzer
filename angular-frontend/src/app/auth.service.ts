import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';

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
}


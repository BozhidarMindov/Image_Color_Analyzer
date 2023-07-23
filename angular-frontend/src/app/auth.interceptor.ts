import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the JWT token from AuthService
    const token = this.authService.getAuthToken();

    // Clone the request and add the Authorization header with the token
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Continue the request with the new headers
    return next.handle(authReq);
  }
}

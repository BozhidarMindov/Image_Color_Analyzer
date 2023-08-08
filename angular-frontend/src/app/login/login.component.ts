import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {share} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  login(): void {

    // Check if all fields are filled
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.authService.validatePassword(this.password)){
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    if (!this.authService.validateEmail(this.email)){
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Check if user is already logged in
    const isLoggedIn = this.authService.isLoggedIn();

    // Attempt user login
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Delete existing token if user is already logged in
        if (isLoggedIn) {
          localStorage.removeItem('access_token');
        }

        // Handle successful login
        localStorage.setItem('access_token', response.access_token); // Store the JWT token in local storage
        this.router.navigate(['/']);
      },
      (error) => {
        if (error.status === 409) {
          this.errorMessage = this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
      }
    );
    share()
  }
}



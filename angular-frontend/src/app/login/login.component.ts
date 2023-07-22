import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

    // Attempt user login
    this.authService.login(this.email, this.password).subscribe(
      () => {
        // Handle successful login
        this.router.navigate(['/']);
      },
      (error) => {
        if (error.status === 409) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
      }
    );
  }
}



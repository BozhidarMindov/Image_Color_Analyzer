import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  formSubmitted: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  register(): void {
    this.formSubmitted = true;

    // Check if all fields are filled
    if (!this.username || !this.email || !this.password) {
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

    this.authService.register(this.username, this.email, this.password).subscribe(
      () => {
        // Handle successful registration
        alert('Account created successfully. Please login.');
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.status === 409) {
          this.errorMessage = error.error.message;

        } else {
          this.errorMessage = 'An error occurred during registration. Please try again later.';
        }
      }
    );
  }
}



import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
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
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  register(): void {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe(
      () => {
        // Handle successful registration
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.status === 409) {
          this.errorMessage = error.error.message; // Set the error message from the backend
        } else {
          // Handle registration error
        }
      }
    );
  }
}


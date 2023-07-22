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

    // Check if the password is at least 8 characters long
    if (this.password.length < 8){
      this.errorMessage = 'Ensure that the password is at least 8 characters long.'
      return
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



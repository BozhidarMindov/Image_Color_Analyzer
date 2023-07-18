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

  constructor(private router: Router, private authService: AuthService) { }

  register(): void {
    this.authService.register(this.username, this.email, this.password).subscribe(
      () => {
        // Handle successful registration
        alert('Account created successfully. Please login.');
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.status === 409) {
          alert(error.error.message);
          this.router.navigate(['/login']);
        } else {
          // Handle registration error
        }
      }
    );
  }
}

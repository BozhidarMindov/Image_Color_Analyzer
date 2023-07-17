import { Component } from '@angular/core';
import { AuthService} from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  register(): void {
    this.authService.register(this.username, this.email, this.password).subscribe(
      (response) => {
        // Handle successful registration
      },
      (error) => {
        // Handle registration error
      }
    );
  }
}


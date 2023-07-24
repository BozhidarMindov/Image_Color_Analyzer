import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isCollapsed = true;
  currentUser =  "";

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  getCurrentUser(): void {
    // Call the AuthService method to get the user information from the backend

    this.authService.getUserInformation().subscribe(
      (response) => {
        if (response.user_info) {
          this.currentUser = response.user_info.username;
        }
      },
      (error) => {
        // Handle error if required
        if (error.status === 401){
           this.router.navigate(['/login']);
        }
      }
    );
  }
}

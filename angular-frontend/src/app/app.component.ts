import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
   if (!this.authService.isLoggedIn()) {
       // If the user is not logged in, redirect to the login page
       this.authService.redirectToLogin();
     }
  }
}

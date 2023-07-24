import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: string | null = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    // Get the username of the current user when the app starts
    this.authService.getCurrentUser().subscribe(
      username => this.currentUser = username
    );
    console.log(this.currentUser)
  }
}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../auth.service';

interface UserInfo {
  username: string;
  email: string;
}

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {
  userInfo: UserInfo | null = null;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUserInfo()
  }

  fetchUserInfo(): void {
    this.authService.getUserInformation().subscribe(
      (response: { user_info: UserInfo | null }) => {
        if (response.user_info) {
          this.userInfo = response.user_info;
        } else {
          this.authService.redirectToLogin();
        }
      },
      (error) => {
       this.authService.redirectToLogin();
      }
    );
  }
  logout(): void {
    this.authService.redirectToLogin();
  }
}


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
  username: string = '';
  userInfo: UserInfo | null = null;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.fetchUserInfo();
    });
  }

  fetchUserInfo(): void {
    this.authService.getUserInformation().subscribe(
      (response: { user_info: UserInfo | null }) => {
        if (response.user_info && response.user_info.username === this.username) {
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
}


import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{
   constructor(private router: Router) { }

  shouldShowNavbar(): boolean {
     // Check if the current route is the login or register page
     const currentRoute = this.router.url;
     return !(currentRoute.includes('/login') || currentRoute.includes('/register'));
  }

  shouldShowFooter(): boolean {
      // Check if the current route is the login or register page
     const currentRoute = this.router.url;
     return !(currentRoute.includes('/login') || currentRoute.includes('/register'));
  }
}

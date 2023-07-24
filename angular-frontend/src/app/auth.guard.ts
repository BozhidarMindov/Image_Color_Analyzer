import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
     if (!this.authService.isLoggedIn()) {
       // If the user is not logged in, redirect to the login page
       this.router.navigate(['/login']);
       return false;
     }
     return true;
   }
}

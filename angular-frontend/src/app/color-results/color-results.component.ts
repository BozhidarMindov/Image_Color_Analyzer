import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ColorDataService } from '../color-data.service';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-color-results',
  templateUrl: './color-results.component.html',
  styleUrls: ['./color-results.component.scss']
})

export class ColorResultsComponent implements OnInit {
  userColorResultsData: any[] = [];
  currentUser = ""
  errorMessage: string = '';

  constructor(private router: Router, private colorDataService: ColorDataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.colorDataService.getUserColorResultsData().subscribe(
      (data) => {
        // @ts-ignore
        this.userColorResultsData = data;
      },
      () => {
        this.authService.redirectToLogin()
      }
    );
    this.getCurrentUser()
  }

  analyzeImage(imageIdentifier: string): void {
    this.router.navigate([`/image-analysis/${this.currentUser}/${imageIdentifier}`]);
  }

  deleteImageAndAnalysis(imageIdentifier: string): void{
      this.colorDataService. deleteImageAndAnalysis(imageIdentifier).subscribe(
          () => {
               this.userColorResultsData = this.userColorResultsData.filter(data => data.imageIdentifier !== imageIdentifier);
          },
          () => {
             this.errorMessage = 'Could not delete image'
          }
        );
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
           this.authService.redirectToLogin();
        }
      }
    );
  }
}




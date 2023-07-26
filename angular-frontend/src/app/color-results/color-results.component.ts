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

  constructor(private router: Router, private colorDataService: ColorDataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.colorDataService.getUserColorResultsData().subscribe(
      (data) => {
        // @ts-ignore
        this.userColorResultsData = data;
        console.log(this.userColorResultsData)
      },
      (error) => {
        if (error.status === 401) {
          this.authService.redirectToLogin()
        }
      }
    );
  }

  analyzeImage(imageUrl: string): void {
    this.router.navigate(['/color-analysis', imageUrl]);
  }
}




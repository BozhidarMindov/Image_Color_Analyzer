import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-color-results',
  templateUrl: './color-results.component.html',
  styleUrls: ['./color-results.component.scss']
})
export class ColorResultsComponent implements OnInit {
  colorData: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['colorData']) {
      this.colorData = navigationState['colorData'];
    }
  }
}


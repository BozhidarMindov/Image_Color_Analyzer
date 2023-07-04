import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ColorDataService } from '../color-data.service';

@Component({
  selector: 'app-color-results',
  templateUrl: './color-results.component.html',
  styleUrls: ['./color-results.component.scss']
})
export class ColorResultsComponent implements OnInit {
  colorData: any[] = [];

  constructor(private router: Router, private colorDataService: ColorDataService) { }

  ngOnInit(): void {
     this.colorData = this.colorDataService.getColorData();
  }
}


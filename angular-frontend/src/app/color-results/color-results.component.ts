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
  imageUrl: string | null = null;
  cropperSettings: any;
  croppedImage: any = null;

  constructor(private router: Router, private colorDataService: ColorDataService) {
    this.cropperSettings = {
      width: 200,
      height: 200,
      keepAspect: false,
      cropOnResize: true,
      preserveSize: true
    };
  }

  ngOnInit(): void {
     // @ts-ignore
    this.colorData = this.colorDataService.getColorData()["colorData"];
    // @ts-ignore
    this.imageUrl = this.colorDataService.getColorData()["imageUrl"];
  }
}




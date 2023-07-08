import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ColorDataService} from "../color-data.service";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
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
    this.colorData = [
      {'color': '#0b87d3', 'frequency': '0.243'},
      {'color': '#292513', 'frequency': '0.106'},
      {'color': '#a95504', 'frequency': '0.101'},
      {'color': '#e15f03', 'frequency': '0.099'},
      {'color': '#703a06', 'frequency': '0.098'},
      {'color': '#555953', 'frequency': '0.087'},
      {'color': '#3a80bc', 'frequency': '0.08'},
      {'color': '#ef9907', 'frequency': '0.076'},
      {'color': '#6a7894', 'frequency': '0.067'},
      {'color': '#95744f', 'frequency': '0.044'}];
    // @ts-ignore
    this.imageUrl = 'assets/images/demo.jpg';
  }

  analyzeAnotherImage(): void {
    this.router.navigate(['/']); // Redirect to the homepage
  }
}

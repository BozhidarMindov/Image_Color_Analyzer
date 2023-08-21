import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ColorDataService} from "../../services/color-data.service";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  colorData: any[] = [];
  imageUrl: string = "";
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
      {'hex_color': '#0b87d3', 'rgb_color': '(11, 135, 211)', 'frequency': '0.243'},
      {'hex_color': '#292513', 'rgb_color': '(41, 37, 19)', 'frequency': '0.106'},
      {'hex_color': '#723a06', 'rgb_color': '(114, 58, 6)', 'frequency': '0.101'},
      {'hex_color': '#ac5504', 'rgb_color': '(172, 85, 4)', 'frequency': '0.099'},
      {'hex_color': '#e36003', 'rgb_color': '(227, 96, 3)', 'frequency': '0.098'},
      {'hex_color': '#545853', 'rgb_color': '(84, 88, 83)', 'frequency': '0.087'},
      {'hex_color': '#3c80bb', 'rgb_color': '(60, 128, 187)', 'frequency': '0.08'},
      {'hex_color': '#ef9a07', 'rgb_color': '(239, 154, 7)', 'frequency': '0.076'},
      {'hex_color': '#6d7893', 'rgb_color': '(109, 120, 147)', 'frequency': '0.067'},
      {'hex_color': '#94734b', 'rgb_color': '(148, 115, 75)', 'frequency': '0.044'}];

    this.imageUrl = 'assets/images/demo.jpg';
  }
}

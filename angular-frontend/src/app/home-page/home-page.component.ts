import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ColorDataService } from '../color-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent {
  numColors: number = 10; // Default value

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private router: Router, private colorDataService: ColorDataService) { }

  onNumColorsChange(value: number): void {
    // @ts-ignore
    const parsedValue = parseInt(value, 10);
    this.numColors = isNaN(parsedValue) ? 10 : Math.min(parsedValue, 20);
    console.log(this.numColors)
  }

  onFileSelected(fileInput: HTMLInputElement): void {
    // No need to do anything here
  }

  uploadImage(): void {
    // @ts-ignore
    const file: File | null = this.fileInput.nativeElement.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append("numColors", this.numColors.toString())

      this.http.post<any[]>('http://localhost:5000/api/colors', formData).subscribe(
        (response: any[]) => {
          console.log(response)
          this.colorDataService.setColorData(response);
          this.router.navigate(['/color-results']);
        },
        (error) => {
          console.log('Error uploading image:', error);
        }
      );
    }
  }
}

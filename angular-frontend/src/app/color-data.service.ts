import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ColorDataService {
  private colorData: any[] = [];

  getColorData(): any[] {
    return this.colorData;
  }

  setColorData(data: any[]): void {
    this.colorData = data;
  }
}

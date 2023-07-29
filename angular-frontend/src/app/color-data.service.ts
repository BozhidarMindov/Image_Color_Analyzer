import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ColorDataService {
  private colorData: any[] = [];
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient){}

  getColorData(): any[] {
    return this.colorData;
  }

  setColorData(data: any[]): void {
    this.colorData = data;
  }

  getUserColorResultsData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user_color_results`);
  }

  getColorDataByImageIdentifier(imageIdentifier: string) {
    return this.http.get<any[]>(`${this.baseUrl}/user_color_analysis/${imageIdentifier}`);
  }

  deleteImageAndAnalysis(imageIdentifier: string){
    return this.http.delete<any[]>(`${this.baseUrl}/user_color_analysis/${imageIdentifier}`);
  }
}

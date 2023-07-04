import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

import { HomePageComponent } from './home-page/home-page.component';
import { ColorResultsComponent } from './color-results/color-results.component';

import { ColorDataService } from './color-data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ColorResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([])
  ],
  providers: [ColorDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

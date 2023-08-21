import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

import { HomePageComponent } from "./components/home-page/home-page.component";
import { ColorResultsComponent } from "./components/color-results/color-results.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { DemoComponent } from "./components/demo/demo.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { UserInformationComponent } from "./components/user-information/user-information.component";
import { ColorAnalysisComponent } from './components/color-analysis/color-analysis.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { ColorDataService } from "./services/color-data.service";
import { AuthService} from "./services/auth.service";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { LoadingInterceptor } from "./interceptors/loading.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ColorResultsComponent,
    NavbarComponent,
    FooterComponent,
    DemoComponent,
    LoginComponent,
    RegisterComponent,
    UserInformationComponent,
    ColorAnalysisComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    NgbModule,
  ],
  providers: [ColorDataService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

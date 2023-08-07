import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { ColorResultsComponent } from './color-results/color-results.component';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from "./auth.guard";
import { UserInformationComponent } from "./user-information/user-information.component";
import {ColorAnalysisComponent} from "./color-analysis/color-analysis.component";

const routes: Routes = [
  { path: '', title: 'ImageColorAnalyzer', component: HomePageComponent, canActivate: [AuthGuard],},
  { path: 'color-results/:username', title: 'Color Analyses', component: ColorResultsComponent, canActivate: [AuthGuard]},
  { path: 'image-analysis/:username/:imageIdentifier', title: 'Image Analysis', component: ColorAnalysisComponent, canActivate: [AuthGuard]},
  { path: 'login', title: 'Sign in', component: LoginComponent },
  { path: 'register', title: 'Sign up', component: RegisterComponent },
  { path: 'user-info/:username', title: 'User info', component: UserInformationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


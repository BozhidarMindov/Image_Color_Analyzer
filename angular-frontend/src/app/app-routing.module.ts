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
  { path: '', component: HomePageComponent, canActivate: [AuthGuard]},
  { path: 'color-results/:username', component: ColorResultsComponent, canActivate: [AuthGuard]},
  { path: 'image-analysis/:username/:imageIdentifier', component: ColorAnalysisComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-info/:username', component: UserInformationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


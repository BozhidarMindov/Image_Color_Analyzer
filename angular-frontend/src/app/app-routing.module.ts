import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent} from "./components/home-page/home-page.component";
import { ColorResultsComponent } from './components/color-results/color-results.component';
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthGuard} from "./guards/auth.guard";
import { UserInformationComponent } from "./components/user-information/user-information.component";
import { ColorAnalysisComponent } from "./components/color-analysis/color-analysis.component";

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


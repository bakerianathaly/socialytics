import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { InstagramComponent } from './instagram/instagram/instagram.component';
import { AuthGuard } from './guards/auth.guard'; // AuthGuard's service to restrict routes before login

//New Routes
import { LandscapeComponent } from './landscape/landscape.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PredictionComponent } from './prediction/prediction.component'
import { UserprofileComponent } from './userprofile/userprofile.component'
import { RecomendationsComponent } from './recomendations/recomendations.component'

const routes: Routes = [
    {path:'', component: LandscapeComponent},
    {path:'signup', component: SignUpComponent},
    {path:'login', component: LoginComponent},
    // canActivate:[AuthGuard]: It protects user's routes from unauthorized access.
    {path:'home', component: ProfileComponent, canActivate: [AuthGuard]}, 
    {path: 'prediction', component: PredictionComponent, canActivate: [AuthGuard]},
    {path:'userprofile', component:UserprofileComponent, canActivate: [AuthGuard]},
    {path:'recommendation', component:RecomendationsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
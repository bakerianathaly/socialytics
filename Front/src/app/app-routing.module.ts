import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { InstagramComponent } from './instagram/instagram/instagram.component';
import { AuthGuard } from './guards/auth.guard'; // AuthGuard's service to restrict routes before login

//Routas de la tesis
import { LandscapeComponent } from './landscape/landscape.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { CuentaInstagramComponent } from './cuenta-instagram/cuenta-instagram.component'

const routes: Routes = [
    {path:'', component: LandscapeComponent},
    {path:'signup', component: SignUpComponent},
    {path:'login', component: LoginComponent},
    {path:'profile', component: ProfileComponent, canActivate: [AuthGuard]}, // canActivate:[AuthGuard]: It protects user's routes from unauthorized access.
    {path:'userprofile', component:UserprofileComponent},
    {path: 'home', component: CuentaInstagramComponent},
    {
        //The route would be socialytics/instagram/<the childrens of the instagram route>
        path: 'instagram', component: InstagramComponent, children: [{
        path: '', component: InstagramComponent}]
    } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
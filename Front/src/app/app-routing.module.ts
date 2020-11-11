import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { InstagramComponent } from './instagram/instagram/instagram.component';

//Routas de la tesis
import { LandscapeComponent } from './landscape/landscape.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { CuentaInstagramComponent } from './cuenta-instagram/cuenta-instagram.component'

const routes: Routes = [
    {path:'', component: LandscapeComponent},
    {path:'signup', component: SignUpComponent},
    {//The route would be socialytics/instagram/<the childrens of the instagram route>
      path: 'instagram', component: InstagramComponent, children: [
        {path: '', component: InstagramComponent}
      ]
    },
    {path: 'home', component: CuentaInstagramComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
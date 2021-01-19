import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { InstagramModule } from './instagram/instagram.module'
import { HttpClientModule } from '@angular/common/http';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ThemeService } from 'ng2-charts';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandscapeComponent } from './landscape/landscape.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { ExportdataService } from './services/exportdata.service';
import { ProfileComponent } from './profile/profile.component';
import { PredictionComponent } from './prediction/prediction.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { RecomendationsComponent } from './recomendations/recomendations.component';

registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LandscapeComponent,
    LoginComponent,
    ProfileComponent,
    PredictionComponent,
    UserprofileComponent,
    RecomendationsComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InstagramModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ],
  /** config ng-zorro-antd i18n (language && date) **/
  providers   : [
    { provide: NZ_I18N, useValue: en_US },
    ThemeService,
    AuthService,
    ExportdataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

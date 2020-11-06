import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

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

registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LandscapeComponent
  ],
  imports: [
    BrowserModule,
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
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

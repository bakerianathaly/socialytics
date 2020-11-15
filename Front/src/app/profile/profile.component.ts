import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service';

declare var FB: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public fbToken: String = ""
  public fbExpiredToken: Number = 0

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '1537824486409545',
        cookie     : true,
        xfbml      : true,
        version    : 'v9.0'
      });
      FB.AppEvents.logPageView();
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  public loginStatus(){
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('loginStatus')
        console.log(response.authResponse);
        this.fbToken = response.authResponse.accessToken
        this.fbExpiredToken = response.authResponse.expiresIn
      }
      else{
        this.facebookLogin()
        console.log('estoy en el else',response)
      }
    })
  }

  public facebookLogin(){
    FB.login((response)=> {
      console.log('submitLogin',response);
      if (response.authResponse){
        console.log('login successful', response);
        this.fbToken = response.authResponse.accessToken
        this.fbExpiredToken = response.authResponse.expiresIn
      }
      else{
        console.log('User login failed');
      }
    },{scope: 'instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement'});
  }

  public submitLogin(){
    console.log("submit login to facebook");
    if (this.fbToken == '' || this.fbExpiredToken == 0){
      this.loginStatus()
    }
    console.log(this.fbExpiredToken)
    console.log(this.fbToken)
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

}

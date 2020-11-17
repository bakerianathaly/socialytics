import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

declare var FB: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public fbToken: String = localStorage.getItem("FB_ACCESS_TOKEN") 
  public fbExpiredToken: String = localStorage.getItem("FB_EXPIRES_IN") 
  private nodeAPI: String = 'https://localhost:3000'
  public id: String = '5faec2f58a077256552cb0e9'

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.facebookConfig()
  }

  private facebookConfig(){
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

  private loginStatus(){
    return FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.fbToken = response.authResponse.accessToken
        this.fbExpiredToken = response.authResponse.expiresIn
        localStorage.setItem("FB_ACCESS_TOKEN",response.authResponse.accessToken)
        localStorage.setItem("FB_EXPIRES_IN",response.authResponse.expiresIn)
      }
      else{
        this.facebookLogin()
      }
    })
  }

  private facebookLogin(){
    FB.login((response)=> {
      if (response.authResponse){
        this.fbToken = response.authResponse.accessToken
        this.fbExpiredToken = response.authResponse.expiresIn
        localStorage.setItem("FB_ACCESS_TOKEN",response.authResponse.accessToken)
        localStorage.setItem("FB_EXPIRES_IN",response.authResponse.expiresIn)
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sorry, the authentication has fail please try again'
        })
      }
    },{scope: 'instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement'});
  }

  protected async submitLogin(){
    if (this.fbToken == null|| this.fbExpiredToken == null){
      const x = await this.loginStatus() 
    }
    console.log('1',this.fbToken)
    this.nodeAPI = this.nodeAPI+'/instagram/statistics?fbToken='+this.fbToken+'&socialyticsId='+this.id
    console.log('2',this.nodeAPI)

    this.http.get(this.nodeAPI.toString()).subscribe((response: any) => {
      console.log('3',response)
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
    });
  }

  public logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

}

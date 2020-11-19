import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, EMPTY } from 'rxjs';
import { map, concatMap, finalize } from 'rxjs/operators';
import { User } from '../models/user';



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
  private user: User
  private current:Array<User>=[];

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.facebookConfig()
    this.user=this.authService.getcurrentUser()
    this.current.push(this.user)
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

  private loginStatus(): boolean{
    FB.getLoginStatus(response => {
      if (response.authResponse) {
        this.fbToken = response.authResponse.accessToken
        this.fbExpiredToken = response.authResponse.expiresIn
        localStorage.setItem("FB_ACCESS_TOKEN",response.authResponse.accessToken)
        localStorage.setItem("FB_EXPIRES_IN",response.authResponse.expiresIn)
      } 
      else {
        var aux = this.facebookLogin()
        console.log('holi',aux)
      }
    });

    if (localStorage.getItem('FB_ACCESS_TOKEN')){
      return true
    } 
    else{
      return false
    } 
    // FB.getLoginStatus((response) => {
    //   if (response.status === 'connected') {
    //     this.fbToken = response.authResponse.accessToken
    //     this.fbExpiredToken = response.authResponse.expiresIn
    //     localStorage.setItem("FB_ACCESS_TOKEN",response.authResponse.accessToken)
    //     localStorage.setItem("FB_EXPIRES_IN",response.authResponse.expiresIn)
    //   }
    //   else{
    //     this.facebookLogin()
    //   }
    // })
  }

  private facebookLogin(): boolean{

    // return from(new Promise<fb.StatusResponse>(resolve => FB.login(resolve,{scope: 'instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement'})))
    //         .pipe(concatMap(({ authResponse }) => {
    //             if (!authResponse) return EMPTY;
    //             return of(authResponse.accessToken);
    //         }));

    FB.login((response: any)=> {
      const { authResponse } = response
      if (authResponse){
        this.fbToken = authResponse.accessToken
        this.fbExpiredToken = authResponse.expiresIn
        localStorage.setItem("FB_ACCESS_TOKEN", authResponse.accessToken)
        localStorage.setItem("FB_EXPIRES_IN", authResponse.expiresIn)
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sorry, the authentication has fail please try again'
        })
      }
    },{scope: 'instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement'});

    if (localStorage.getItem('FB_ACCESS_TOKEN')){
      return true
    } 
    else{
      return false
    } 
  }

  protected async submitLogin(){

    if (!this.fbToken|| !this.fbExpiredToken) {
      const auth = await this.loginStatus()
      console.log('auth',auth)
      if (auth) {
        this.nodeAPI = this.nodeAPI+'/instagram/statistics?fbToken='+this.fbToken+'&socialyticsId='+this.id
  
        this.http.get(this.nodeAPI.toString()).subscribe((response: any) => {
          console.log(response)
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.message
          })
        });
      } else console.warn('[AYURA]', this.fbToken)
    }
  }

  public logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
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
  private nodeAPI: String = 'https://localhost:3000' //Basic URL to the API
  private user: User
  private current:Array<User>=[];
  public instagramData: any //Basic user instagram data
  public instagramMedia: any //First 25 pictures of the user

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user=this.authService.getcurrentUser()
    this.current.push(this.user) 
    console.log('[TOKEN]', this.fbToken)
    Swal.fire({
      icon: 'warning',
      title: 'Welcome to Socialytics.',
      text: 'Obtaining and processing your information. This may take a few minutes, please be patient.',
      showConfirmButton: false,
      timer: 25000
    })
    this.getInstagramData()
    this.getMedia()
  }

  protected getInstagramData(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/instagram/statistics?fbToken='+this.fbToken+'&socialyticsId='+this.user.id
  
    this.http.get(nodeAPI.toString()).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.instagramData = response.instagram.userData
      localStorage.setItem("INSTAGRAM_DATA", JSON.stringify(this.instagramData))
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
  }

  protected getMedia(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/instagram/getmedia?fbToken='+this.fbToken+'&socialyticId='+this.user.id
  
    this.http.get(nodeAPI.toString()).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.instagramMedia = response.allMediaInfo
      localStorage.setItem("INSTAGRAM_DATA", JSON.stringify(this.instagramData))
      console.log('[MEDIA]', response.allMediaInfo.mediaInfo)
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
    
  }

  public logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

}

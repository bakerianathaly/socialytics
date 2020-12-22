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
  private nodeAPI: String = 'https://localhost:3000'
  private user: User
  private current:Array<User>=[];
  public instagramData: any //Basic user instagram data
  public instagramMedia: any //First 25 pictures of the user

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user=this.authService.getcurrentUser()
    this.current.push(this.user) 
    console.log('[TOKEN]', this.fbToken)
    this.getInstagramData()
    
  }

  protected getInstagramData(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    this.nodeAPI = this.nodeAPI+'/instagram/statistics?fbToken='+this.fbToken+'&socialyticsId='+this.user.id
  
    this.http.get(this.nodeAPI.toString()).subscribe((response: any) => {
      /*If there is none error, we remove the INSTAGRAM_DATA from the storage (if it exists), set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.instagramData = response.instagram.userData
      this.instagramMedia = response.instagram.media
      localStorage.setItem("INSTAGRAM_DATA", JSON.stringify(this.instagramData))
      localStorage.setItem("INSTAGRAM_MEDIA", JSON.stringify(this.instagramMedia))
      console.log('[LOCAL]', this.instagramData)
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

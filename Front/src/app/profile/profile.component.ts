import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, EMPTY, empty } from 'rxjs';
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
  private user: User
  private current:Array<User>=[];
  private instagramData = []
  public sumary = ["Posts","Followers","Following"] 

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user=this.authService.getcurrentUser()
    this.current.push(this.user) 
    console.log('[TOKEN]', this.fbToken)
    if(this.fbToken){
      this.getInstagramData()
    }
  }

  protected async submitLogin(){
    if(!this.fbExpiredToken || !this.fbToken){
      this.fbToken = localStorage.getItem("FB_ACCESS_TOKEN") 
      this.fbExpiredToken = localStorage.getItem("FB_EXPIRES_IN") 
    }
    console.log('tenemos el token: ',this.fbToken)
    this.getInstagramData()
  }

  protected getInstagramData(){
    this.nodeAPI = this.nodeAPI+'/instagram/statistics?fbToken='+this.fbToken+'&socialyticsId='+this.user.id
  
    this.http.get(this.nodeAPI.toString()).subscribe((response: any) => {
      localStorage.removeItem('INSTAGRAM_DATA')
      console.log('[RESPONSE]',response.instagram[0])
      localStorage.setItem('INSTAGRAM_DATA', response.instagram[0])
      this.instagramData[0] = response.instagram[0]
      console.log('[INSTAGRAM DATA]', this.instagramData[0])
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

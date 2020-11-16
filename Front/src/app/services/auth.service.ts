import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { JwtResponse } from '../models/jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject} from 'rxjs';


@Injectable()
export class AuthService {
   
    ApiServer: string='https://localhost:3000'
    authSubject= new BehaviorSubject(false)
    private token: string 
   

    constructor(private httpClient: HttpClient) { }
    // login method to authenticate the user 
    login(user:User):Observable<JwtResponse>{
      // in case of a response it will save the token based on the request.
      return this.httpClient.post<JwtResponse>(this.ApiServer + '/login',user).pipe(tap( 
        (res) => { 
          if (res){
            //save token from the back.
            this.saveToken(res)
          }
          
        })
      );
    }
    // logout method. 
    logout(): void {
      this.token=''
      localStorage.removeItem("ACCESS_TOKEN")
      localStorage.removeItem("EXPIRES_IN")
      localStorage.removeItem("FB_ACCESS_TOKEN")
      localStorage.removeItem("FB_EXPIRES_IN")
    }
     // method to save the token in localStorage.
    private saveToken(res:JwtResponse): void{
      
      localStorage.setItem("ACCESS_TOKEN",res.datos.accessToken)
      localStorage.setItem("EXPIRES_IN",res.datos.expiresIn)
      this.token=res.datos.accessToken
      
    
    }
    // method to get the token in case if it doesn't exist.
    getToken(): string {
      
      if (!this.token) {
         this.token = localStorage.getItem("ACCESS_TOKEN")
      }
      return this.token
    }

}

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
    private user: User
    
   

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
      localStorage.removeItem('ACCESS_AUTH')
      localStorage.removeItem("FB_ACCESS_TOKEN")
      localStorage.removeItem("FB_EXPIRES_IN")
      localStorage.removeItem('INSTAGRAM_DATA')
    }
     // method to save the token in localStorage.
    private saveToken(res:JwtResponse): void{
      
       localStorage.setItem('ACCESS_AUTH', JSON.stringify(res.datos));
      
    }
    // Function to retrieve user's values from LocalStorage.
    getcurrentUser():User {
      
      this.user=JSON.parse(localStorage.getItem('ACCESS_AUTH'))
      
      if (this.user){
         return this.user
      }
      return null
    }

    // method to get the token in case if it doesn't exist.
    getToken(): string {
      
      if (!this.token) {
         this.token = localStorage.getItem('ACCESS_AUTH')
      }
      return this.token
    }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService,private router: Router) { }
  // method to verify if the user is loggedin in order to access other app's routes.
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if a token doesn't exist , the user won't be allowed until he's already loggedin.
    if(!this.authService.getToken()){
      
       this.router.navigate(['login'])
       return false
       
    }
   
   return true
  
  }
  
}

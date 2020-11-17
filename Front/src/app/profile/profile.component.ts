import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from '../services/auth.service';
import { User } from '../models/user';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  private user: User
  private current:Array<User>=[];
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
     this.user=this.authService.getcurrentUser()
     this.current.push(this.user)
  }
  
  logout(){
     this.authService.logout()
     this.router.navigate(['/'])
  }

}

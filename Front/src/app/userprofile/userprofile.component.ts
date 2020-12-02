import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  public formGroup: FormGroup
  public subM: boolean = false 
  public industry = [] //JSON variable to make the selection input dynamic
  public error: String = '' 
  isShown1:boolean=false
  isShown2:boolean=false
  isShown3:boolean=false
  isShown4:boolean=false
  isShown5:boolean=false
  

  constructor(private authService: AuthService,private http: HttpClient, private router: Router) { }

  ngOnInit() {
    
    this.industrySelect()
    //Creating the form validation showing the view
    this.formGroup = new FormGroup({
      firstName: new FormControl('', [
        
      ]),
      lastName: new FormControl('', [
        
      ]),
      email: new FormControl('', [
         Validators.email
      ]),
      password: new FormControl('', [
        
         Validators.minLength(8)
      ]),
      industry: new FormControl(-1, [
        
      ])
    })

  }

  ShowField1() {
     this.isShown1=!this.isShown1
  }
  ShowField2() {
     this.isShown2=!this.isShown2
  }
  ShowField3() {
     this.isShown3=!this.isShown3
  }
  ShowField4() {
     this.isShown4=!this.isShown4
  }
  ShowField5() {
    this.isShown5=!this.isShown5
  }
   /*Function industrySelect() it help to create a more dynamic select options in the .html*/
  public industrySelect(){
    //It only assigned the industry name as a JSON form to the industry variable 
    this.industry = [
     {'name': "Agencies (Marketing/PR/Events/etc.)"},
     {'name': "Broadcast Media"},
     {'name': "Consumer Finance"},
     {'name': "CPG / Beauty"},
     {'name': "Influencer"},
     {'name': "Educational Institution"},
     {'name': "Entertainment"},
     {'name': "Fashion"},
     {'name': "Food &amp; Beverages"},
     {'name': "Government / Government Agency"},
     {'name': "Gaming &amp; eSports"},
     {'name': "Industry Association"},
     {'name': "Management Consultancy"},
     {'name': "News Media &amp; Publishing"},
     {'name': "Non-Profit Organization"},
     {'name': "Retail"},
     {'name': "Sports &amp; Sporting Events"},
     {'name': "Brand"},
     {'name': "Other"}
    ]
  }

}

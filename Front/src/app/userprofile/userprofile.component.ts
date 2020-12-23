import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
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
  private user: User = {} as User // update user model for the form.
  private userLocal: User = {} as User // user retrieved from localStorage.
  private current:Array<User>=[];
  isShown1:boolean=false // variable to show and hide the input field.
  isShown2:boolean=false
  isShown3:boolean=false
  isShown4:boolean=false
  isShown5:boolean=false
  

  constructor(private authService: AuthService,private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // to get the current user from localstorage.
    this.userLocal=this.authService.getcurrentUser()
    // to display user's data into an array to the view.
    this.current.push(this.userLocal) 
    
    this.industrySelect()
    //Creating the form validation showing in the view
    this.formGroup = new FormGroup({
      firstName: new FormControl(this.userLocal.name,[
         Validators.required
      ]),
      lastName: new FormControl(this.userLocal.lastName,[
         Validators.required
      ]),
      email: new FormControl(this.userLocal.email,[
         Validators.required,
         Validators.email
      ]),
      password: new FormControl('',[
         Validators.minLength(8)
      ]),
      industry: new FormControl(this.userLocal.industry,[
         Validators.required
      ])
    })

  }
  // Hide and Show input fields functions.
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
  // Function to submit the update form.
  private onSubmit(){
      
       if (this.formGroup.get('firstName').value != '' && this.formGroup.get('lastName').value != '' && this.formGroup.get('email').value != '' 
       && this.formGroup.get('password').value != '' && this.formGroup.get('password').value.length >= 8 && this.formGroup.get('industry').value != ''){
        
          this.user.id=this.userLocal.id
          this.user.name = this.formGroup.get('firstName').value
          this.user.lastName = this.formGroup.get('lastName').value
          this.user.email = this.formGroup.get('email').value
          this.user.password = Md5.hashStr(this.formGroup.get('password').value).toString()
          this.user.industry = this.formGroup.get('industry').value
          this.user.accessToken=this.userLocal.accessToken
          this.user.expiresIn=this.userLocal.expiresIn
          
          /*The last step is to call the API route to make the insert
          if the response is not an error, then it appears an success alert and redirect to the profile view
          if the response is an error, it appears an error alert and stay in the form*/
          this.http.post("https://localhost:3000/update", this.user).subscribe((response: any) => {
            Swal.fire(
              response.message,
              '',
              'success'
            ).then(results => {
               this.router.navigate(['profile'])
               localStorage.setItem('ACCESS_AUTH', JSON.stringify(this.user))
            })
            
          }, error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message
            })
          });
        
        }

        else if (this.formGroup.get('firstName').value != '' && this.formGroup.get('lastName').value != '' && this.formGroup.get('email').value != '' 
          && this.formGroup.get('password').value == '' && this.formGroup.get('industry').value != ''){
        
          this.user.id=this.userLocal.id
          this.user.name = this.formGroup.get('firstName').value
          this.user.lastName = this.formGroup.get('lastName').value
          this.user.email = this.formGroup.get('email').value
          this.user.password = this.userLocal.password
          this.user.industry = this.formGroup.get('industry').value
          this.user.accessToken=this.userLocal.accessToken
          this.user.expiresIn=this.userLocal.expiresIn
          
          /*The last step is to call the API route to make the insert
          if the response is not an error, then it appears an success alert and redirect to the profile view
          if the response is an error, it appears an error alert and stay in the form*/
          this.http.post("https://localhost:3000/update", this.user).subscribe((response: any) => {
            Swal.fire(
              response.message,
              '',
              'success'
            ).then(results => {
                this.router.navigate(['profile'])
                localStorage.setItem('ACCESS_AUTH', JSON.stringify(this.user))
            })
            
          }, error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message
            })
          });
        
        }

      else{
         
        if (this.formGroup.get('password').value.length < 8 && this.formGroup.get('password').value != ''){
          /*This only works to know if the password received from the form is less than 8 characters
          if it does, the error variable is assigned with the error name*/
           this.error = 'length'
        }

        /*If it doesn't, it is just assigned true to the global error handle variable*/
        this.subM = true

      }
         
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

  public return(){
     this.router.navigate(['profile'])
  }  

}

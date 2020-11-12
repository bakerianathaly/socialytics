import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from'sweetalert2';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service';
import { User } from '../models/user';
import {Md5} from 'ts-md5/dist/md5';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  public formGroup: FormGroup
  public subM: boolean = false 
  public error: String = '' 
  private log: User = {} as User
 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    
    this.formGroup = new FormGroup({
      
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      
    })
  }
   
  private onSubmit(){
    /*First of all, the function validates if the form data is correct according to the formGroup variable
    The validations settings for the formGroup variable are in the ngOnInit() function*/
    if(this.formGroup.get('email').value != ' ' && this.formGroup.get('password').value != ' ' && this.formGroup.get('password').value.length >= 8 ){

        //After the if (the success), the data is assigned to the JSON variable called log
        
         this.log.email=this.formGroup.get('email').value
         this.log.password= Md5.hashStr(this.formGroup.get('password').value).toString()
       
        /*The last step is to call the API route to make the insert
        if the response is not an error, then it appears an success alert and redirect to the profile view
        if the response is an error, it appears an error alert and stay in the form*/
        
        this.authService.login(this.log).subscribe((response: any) => {
          Swal.fire(
            response.message,
            '',
            'success'
          ).then(results => {
            //Route to the user's profile view
            this.router.navigate(['profile']) 
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
      //After the if (the error), the variables to know that an error is present are instantiated
      if (this.formGroup.get('password').value.length < 8 && this.formGroup.get('password').value != ''){
        /*This if works to know if the password received from the form is less than 8 characters
        if it does, the error variable is assigned with the error name*/
        this.error = 'length'
      }
      /*If it doesn't, it is just assigned true to the global error handle variable*/
      this.subM = true
    }
  }
}

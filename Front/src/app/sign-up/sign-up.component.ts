import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from'sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public formGroup: FormGroup
  public subM: boolean = false //Error handle variable*
  public industry = [] //JSON variable to make the selection input dynamic
  public error: String = '' //Error handle variable to the min lenght of the password

  private signUp = {
    name: '',
    lastName: '',
    password: '',
    email: '',
    industry: ''
  } //JSON variable for the data to be send to the API

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    //Call to the industrySelect() function before showing the view
    this.industrySelect()

    //Creating the form validation showing the view
    this.formGroup = new FormGroup({
      firstName: new FormControl('', [
        Validators.required
      ]),
      lastName: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      industry: new FormControl(-1, [
        Validators.required
      ])
    })
  }

  /*Function onSubmit() is the one that receives the form data, 
  it validates if this data is correct before calling the API to make the insert*/
  private onSubmit(){
    /*First of all, the function validates if the form data is correct according to the formGroup variable
    The validations settings for the formGroup variable are in the ngOnInit() function*/
    if(this.formGroup.get('firstName').value != ' ' && this.formGroup.get('lastName').value != ' ' && this.formGroup.get('email').value != ' ' 
      && this.formGroup.get('password').value != ' ' && this.formGroup.get('password').value.length >= 8 && this.formGroup.get('industry').value != -1 ){

        //After the if (the success), the data is assigned to the JSON variable called signUp
        this.signUp.name = this.formGroup.get('firstName').value
        this.signUp.lastName = this.formGroup.get('lastName').value
        this.signUp.password = Md5.hashStr(this.formGroup.get('password').value).toString()
        this.signUp.email = this.formGroup.get('email').value
        this.signUp.industry = this.formGroup.get('industry').value

        /*The last step is to call the API route to make the insert
        if the response is not an error, then it appears an success alert and redirect to the instagram register view
        if the response is an error, it appears an error alert and stay in the form*/
        this.http.post("https://localhost:3000/signup", this.signUp).subscribe((response: any) => {
          Swal.fire(
            response.message,
            '',
            'success'
          ).then(results => {
            //After the swal, we navigate the user to the login
            this.router.navigate(['/login'])
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

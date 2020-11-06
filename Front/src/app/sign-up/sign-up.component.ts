import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public formGroup: FormGroup
  public subM: boolean = false
  public industry = []
  public error: String = '' 

  private singUp = {
    name: '',
    lastName: '',
    password: '',
    email: '',
    industry: ''
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.industrySelect()

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

  private onSubmit(){
    if(this.formGroup.get('firstName').value != ' ' && this.formGroup.get('lastName').value != ' ' && this.formGroup.get('email').value != ' ' 
      && this.formGroup.get('password').value != ' ' && this.formGroup.get('password').value.length >= 8 && this.formGroup.get('industry').value != -1 ){

        this.singUp.name = this.formGroup.get('firstName').value
        this.singUp.lastName = this.formGroup.get('lastName').value
        this.singUp.password = this.formGroup.get('password').value
        this.singUp.email = this.formGroup.get('email').value
        this.singUp.industry = this.formGroup.get('industry').value

        this.http.post("http://localhost:3000/signup", this.singUp).subscribe((response: any) => {
          if(response.status == '200'){
            console.log("perfecto perro")
          }
          else{
            console.log("lo siento perro")
          }
          console.log(response);
        });
    }
    else{
      if (this.formGroup.get('password').value.length < 8 && this.formGroup.get('password').value != ''){
        this.error = 'length'
      }
      this.subM = true
    }
  }

  public industrySelect(){
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
     {'name': "Other"}
    ]
  }

}

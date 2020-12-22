import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import * as CanvasJS from '../../assets/canvasjs.min.js'

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {

  private user: User
  private current:Array<User>=[];
  public instagramData: any = JSON.parse(localStorage.getItem('INSTAGRAM_DATA'))
  private fbToken: String = localStorage.getItem("FB_ACCESS_TOKEN")
  private nodeAPI: String = 'https://localhost:3000'
  public byProfileViews: any
  public byEngagements: any

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user = this.authService.getcurrentUser()
    this.current.push(this.user) 
    this.getBestDayToPostByProfileViews()
  }

  protected getBestDayToPostByProfileViews(){
    if(this.fbToken && this.user.id){
      let API = this.nodeAPI+'/prediction/bestdaybyviews?socialyticId='+this.user.id+'&fbToken='+this.fbToken

      this.http.get(API.toString()).subscribe((response: any) => {
        
        this.byProfileViews = response.byProfileViews
        let chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          theme: "light2", // "light1", "light2", "dark1", "dark2",
          exportEnabled: true,
          axisY: {
            title: "Probability percent"
          },
          axisX: {
            title: "Day of the week"
          },
          data: [{
            type: "column",
            showInLegend: "true",
            legendText: "{label}",
            yValueFormatString: "#,##0.0#\"%\"",
            dataPoints: [
              { y: parseFloat(this.byProfileViews.sunday), label: "Sunday" },
              { y: parseFloat(this.byProfileViews.monday), label: "Monday" },
              { y: parseFloat(this.byProfileViews.tuesday), label: "Tuesday" },
              { y: parseFloat(this.byProfileViews.wednesday), label: "Wednesday" },
              { y: parseFloat(this.byProfileViews.thursday), label: "Thursday" },
              { y: parseFloat(this.byProfileViews.friday), label: "Friday" },
              { y: parseFloat(this.byProfileViews.saturday), label: "Saturday" }
            ]
          }]
        });
          
        chart.render();
      }, error => {
        console.log('[ERROR]', error)
        //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error.message
        })
        this.router.navigate(['/home'])
      });
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your sessions has expired'
      })
      this.authService.logout()
      this.router.navigate(['/'])
    }
  }

  

}

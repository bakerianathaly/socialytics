import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';

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
  public maxValue: any
  public maxDay: String

  public barChartOptions: ChartOptions = { 
    responsive: true,
    scales: { xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Days of the week',
        fontColor: 'black'
      },
      ticks: {
        fontColor: 'black',  // x axe labels (can be hexadecimal too)
      }
    }], 
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Probability percent',
          fontColor: 'black',
        },
        ticks: {
          fontColor: 'black',  // x axe labels (can be hexadecimal too)
        }
      }] 
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public nath: Color[] = [
    { backgroundColor: '#5B54FB' },
  ]

  public barChartData: any[] = [
  ];

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user = this.authService.getcurrentUser()
    this.current.push(this.user) 
    this.getBestDayToPostByProfileViews()
  }

  private getMaxValueDay(values: any){
    if(this.maxValue == values.monday ){
      this.maxDay = 'Monday'
    }
    else if(this.maxValue == values.tuesday ){
      this.maxDay = 'Tuesday'
    }
    else if(this.maxValue == values.wednesday ){
      this.maxDay = 'Wednesday'
    }
    else if(this.maxValue == values.thursday ){
      this.maxDay = 'Thursday'
    }
    else if(this.maxValue == values.friday ){
      this.maxDay = 'Friday'
    }
    else if(this.maxValue == values.saturday ){
      this.maxDay = 'Saturday'
    }
    else{ 
      this.maxDay = 'Sunday'
    }
  }

  protected getBestDayToPostByProfileViews(){
    if(this.fbToken && this.user.id){
      let API = this.nodeAPI+'/prediction/bestdaybyviews?socialyticId='+this.user.id+'&fbToken='+this.fbToken

      this.http.get(API.toString()).subscribe((response: any) => {
        
        this.maxValue = [
          response.byProfileViews.sunday,
          response.byProfileViews.monday,
          response.byProfileViews.tuesday,
          response.byProfileViews.wednesday,
          response.byProfileViews.thursday,
          response.byProfileViews.friday,
          response.byProfileViews.saturday
        ]
        this.barChartData.push({ data: this.maxValue, label: 'Porbability percent' })
        this.maxValue = Math.max(...this.maxValue)
        this.getMaxValueDay(response.byProfileViews)
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

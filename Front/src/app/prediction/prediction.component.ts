import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { ExportdataService } from '../services/exportdata.service';
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
  public instagramData: any = JSON.parse(localStorage.getItem('INSTAGRAM_DATA')) //Instagram basic info from the user, we set it in the local storage at the profile.component.ts
  private instagramMedia: any = JSON.parse(localStorage.getItem('INSTAGRAM_MEDIA'))
  private fbToken: String = localStorage.getItem("FB_ACCESS_TOKEN") //Facebook token, we set it in the local storage at the profile.component.ts
  private nodeAPI: String = 'https://localhost:3000' //Basic URL to the API

  //Comun graphics variables
  public barChartOptions: ChartOptions = { 
    responsive: true,
    //Axis configuration
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
          fontColor: 'black',  // y axe labels (can be hexadecimal too)
        }
      }] 
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
        formatter: (value, ctx) => {
          var perc = value + "%";
          return perc;
        }
      }
    },
    legend: {
      display: true,
      labels: {
        fontColor: 'black'
      }
    }
  };
  public barChartLabels: Label[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  public barChartType: ChartType = 'bar'; //Type of graphic, in this cases are bar graphics
  public barChartLegend = true; //Variable to display the legend 
  public barChartPlugins = [pluginDataLabels];

  //Best day to post by profile views graphics variables
  public byProfileViewsColor: Color[] = [
    { backgroundColor: '#5B54FB' },
  ]
  public byProfileViewsExcelData:any[]=[] // Variable that contains all the excel data by profile views to export.
  public byProfileViewsData: any[] = [] //Variable that will contain the data for the Best day to post by profile views graphic
  public maxValuePV: any //Variable that will contain the max value of the profile views graphic
  public maxDayPV: String //Variable that will contain the day who has the max value of the profile views graphic

  //Best day to post by engagement graphics variables
  public byEngagementColor: Color[] = [
    { backgroundColor: '#2eb82e' },
  ]
  public byEngagementExcelData:any[]=[] // Variable that contains all the excel data by engagement to export.
  public byEngagementData: any[] = [] //Variable that will containt the data for the Best day to post by engagement graphic
  public maxValueEng: any //Variable that will contain the max value of the engagement graphic
  public maxDayEng: String //Variable that will contain the day who has the max value of engagement graphic

  //Probable amount of Reach by day of the week graphics variables
  public probableReachColor: Color[] = [
    { backgroundColor: 'rgb(180,93,151)' },
  ]
  public byReachExcelData:any[]=[] // Variable that contains all the excel data by reach to export.
  public probableReachData: any[] = [] //Variable that will contain the data for Probable amount by the day of the week graphic
  public maxValuePR: any //Variable that will contain the max value of the probable reach graphic
  public maxDayPR: String //Variable that will contain the day who has the max value of the probable reach  graphic

  //Probable amount of Impressions by day of the week graphics variables
  public probableIColor: Color[] = [
    { backgroundColor: 'rgb(255,66,96)' },
  ]
  public byImpressionsExcelData:any[]=[] // Variable that contains all the excel data by impressions to export.
  public probableImpressionData: any[] = [] //Variable that will contain the data for Probable amount by the day of the week graphic
  public maxValuePI: any //Variable that will contain the max value of the probable Impressions graphic
  public maxDayPI: String //Variable that will contain the day who has the max value of the probable impressions  graphic

  constructor(private authService: AuthService, private exportService:ExportdataService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    Swal.fire({
      icon: 'warning',
      title: 'Welcome to Socialytics.',
      text: 'Obtaining and processing your information. This may take a few minutes, please be patient.',
      showConfirmButton: false,
      timer: 5000
    })
    this.user = this.authService.getcurrentUser()
    this.current.push(this.user) 
    this.getBestDayToPostByProfileViews()
    this.getBestDayToPostByEngagements()
    this.getProbableReach()
    this.getProbableImpressions()
    
  }

  private getMaxValueDay(values: any, maxValue: number){
    /*Function that return the day of the week who has the max value, it needs all the values that we received in the request 
    and the max value of those values*/
    if(maxValue == values.monday ){
      return 'Monday'
    }
    else if(maxValue == values.tuesday ){
      return 'Tuesday'
    }
    else if(maxValue == values.wednesday ){
      return 'Wednesday'
    }
    else if(maxValue == values.thursday ){
      return 'Thursday'
    }
    else if(maxValue == values.friday ){
      return 'Friday'
    }
    else if(maxValue == values.saturday ){
      return 'Saturday'
    }
    else{ 
      return 'Sunday'
    }
  }

  protected getBestDayToPostByProfileViews(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, the values are send in the url
      After we initialize the URL variable we made the request*/
      let API = this.nodeAPI+'/prediction/bestdaybyviews?socialyticId='+this.user.id+'&fbToken='+this.fbToken

      this.http.get(API.toString()).subscribe((response: any) => {
        /*If the request return with none error, it is initialize the max value variable of the graphic with the 7 values of the response
        After that, we push those values to the variable data of the graphic with the label that will have in the legend */
        this.maxValuePV = [
          response.byProfileViews.sunday,
          response.byProfileViews.monday,
          response.byProfileViews.tuesday,
          response.byProfileViews.wednesday,
          response.byProfileViews.thursday,
          response.byProfileViews.friday,
          response.byProfileViews.saturday
        ]
        this.byProfileViewsExcelData.push({Sunday:response.byProfileViews.sunday+ '%',
        Monday:response.byProfileViews.monday + '%',
        Tuesday:response.byProfileViews.tuesday+ '%',
        Wednesday:response.byProfileViews.wednesday+ '%',
        Thursday:response.byProfileViews.thursday+ '%',
        Friday:response.byProfileViews.friday+ '%',
        Saturday:response.byProfileViews.saturday+ '%'
        })
        this.byProfileViewsData.push({ data: this.maxValuePV, label: 'Probable Profile Views' })
        /*For last, we calculate the max value of the resuqest with the method Math.max, it needs an array of values tu proceed. And after that
        we call the getMaxValueDay function to get the day that will have that max value  */
        this.maxValuePV = Math.max(...this.maxValuePV)
        this.maxDayPV = this.getMaxValueDay(response.byProfileViews, this.maxValuePV)
      }, error => {
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
      //If for some reason the token o the user id does not exist, it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your sessions has expired'
      })
      this.authService.logout()
      this.router.navigate(['/'])
    }
  }

  protected getBestDayToPostByEngagements(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, the values are send in the url
      After we initialize the URL variable we made the request*/
      let API = this.nodeAPI+'/prediction/bestdaybyengagement'
      let info = { //Variable with the JSON that it will be send to the API endpoint 
        socialyticId: this.user.id,
        media: this.instagramMedia
      }

      this.http.post(API.toString(), info).subscribe((response: any) => {
        /*If the request return with none error, it is initialize the max value variable of the graphic with the 7 values of the response
        After that, we push those values to the variable data of the graphic with the label that will have in the legend */
        this.maxValueEng = [
          response.Engagements.sunday,
          response.Engagements.monday,
          response.Engagements.tuesday,
          response.Engagements.wednesday,
          response.Engagements.thursday,
          response.Engagements.friday,
          response.Engagements.saturday
        ]

        this.byEngagementExcelData.push({Sunday:response.Engagements.sunday+ '%',
          Monday:response.Engagements.monday+ '%',
          Tuesday:response.Engagements.tuesday+ '%',
          Wednesday:response.Engagements.wednesday+ '%',
          Thursday:response.Engagements.thursday+ '%',
          Friday:response.Engagements.friday+ '%',
          Saturday:response.Engagements.saturday+ '%'
        })
        
        this.byEngagementData.push({ data: this.maxValueEng, label: 'Probable engagements' })
        /*For last, we calculate the max value of the resuqest with the method Math.max, it needs an array of values tu proceed. And after that
        we call the getMaxValueDay function to get the day that will have that max value  */
        this.maxValueEng= Math.max(...this.maxValueEng)
        this.maxDayEng = this.getMaxValueDay(response.Engagements, this.maxValueEng)
      }, error => {
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
      //If for some reason the token o the user id does not exist, it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your sessions has expired'
      })
      this.authService.logout()
      this.router.navigate(['/'])
    }
  }

  

  protected getProbableReach(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, the values are send in the url
      After we initialize the URL variable we made the request*/
      let API = this.nodeAPI+'/prediction/probablereach?socialyticId='+this.user.id+'&fbToken='+this.fbToken

      this.http.get(API.toString()).subscribe((response: any) => {
        /*If the request return with none error, it is initialize the max value variable of the graphic with the 7 values of the response
        After that, we push those values to the variable data of the graphic with the label that will have in the legend */
        this.maxValuePR = [
          response.probableReachs.sunday,
          response.probableReachs.monday,
          response.probableReachs.tuesday,
          response.probableReachs.wednesday,
          response.probableReachs.thursday,
          response.probableReachs.friday,
          response.probableReachs.saturday
        ]

        this.byReachExcelData.push({Sunday:response.probableReachs.sunday+ '%',
          Monday:response.probableReachs.monday+ '%',
          Tuesday:response.probableReachs.tuesday+ '%',
          Wednesday:response.probableReachs.wednesday+ '%',
          Thursday:response.probableReachs.thursday+ '%',
          Friday:response.probableReachs.friday+ '%',
          Saturday:response.probableReachs.saturday+ '%'
        })
        this.probableReachData.push({ data: this.maxValuePR, label: 'Probable Reach' })
        /*For last, we calculate the max value of the resuqest with the method Math.max, it needs an array of values tu proceed. And after that
        we call the getMaxValueDay function to get the day that will have that max value  */
        this.maxValuePR = Math.max(...this.maxValuePR)
        this.maxDayPR = this.getMaxValueDay(response.probableReachs, this.maxValuePR)
      }, error => {
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
      //If for some reason the token o the user id does not exist, it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your sessions has expired'
      })
      this.authService.logout()
      this.router.navigate(['/'])
    }
  }

  protected getProbableImpressions(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, the values are send in the url
      After we initialize the URL variable we made the request*/
      let API = this.nodeAPI+'/prediction/probableimpressions?socialyticId='+this.user.id+'&fbToken='+this.fbToken

      this.http.get(API.toString()).subscribe((response: any) => {
        /*If the request return with none error, it is initialize the max value variable of the graphic with the 7 values of the response
        After that, we push those values to the variable data of the graphic with the label that will have in the legend */
        this.maxValuePI = [
          response.probableImpressions.sunday,
          response.probableImpressions.monday,
          response.probableImpressions.tuesday,
          response.probableImpressions.wednesday,
          response.probableImpressions.thursday,
          response.probableImpressions.friday,
          response.probableImpressions.saturday
        ]

        this.byImpressionsExcelData.push({Sunday:response.probableImpressions.sunday+ '%',
          Monday:response.probableImpressions.monday+ '%',
          Tuesday:response.probableImpressions.tuesday+ '%',
          Wednesday:response.probableImpressions.wednesday+ '%',
          Thursday:response.probableImpressions.thursday+ '%',
          Friday:response.probableImpressions.friday+ '%',
          Saturday:response.probableImpressions.saturday+ '%'
        })
        this.probableImpressionData.push({ data: this.maxValuePI, label: 'Probable Impressions' })
        /*For last, we calculate the max value of the resuqest with the method Math.max, it needs an array of values tu proceed. And after that
        we call the getMaxValueDay function to get the day that will have that max value  */
        this.maxValuePI = Math.max(...this.maxValuePI)
        this.maxDayPI = this.getMaxValueDay(response.probableImpressions, this.maxValuePI)
      }, error => {
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
      //If for some reason the token o the user id does not exist, it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your sessions has expired'
      })
      this.authService.logout()
      this.router.navigate(['/'])
    }
  }

  public logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

  public exportPdf(DivId){
    this.exportService.generatePDF(DivId)
  }

  public exportExcel(data:any[]){
    console.log('lo q trae',data)
    this.exportService.generateExcel(data)
  }

  public exportPPT(DivId){
    this.exportService.generatePPT(DivId)
  }

}

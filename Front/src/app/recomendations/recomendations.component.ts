import { Component, OnInit, ɵConsole } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-recomendations',
  templateUrl: './recomendations.component.html',
  styleUrls: ['./recomendations.component.css']
})
export class RecomendationsComponent implements OnInit {

  private user: User
  private current:Array<User>=[];
  public instagramData: any = JSON.parse(localStorage.getItem('INSTAGRAM_DATA')) //Instagram basic info from the user, we set it in the local storage at the profile.component.ts
  private instagramMedia: any = JSON.parse(localStorage.getItem('INSTAGRAM_MEDIA'))
  private fbToken: String = localStorage.getItem("FB_ACCESS_TOKEN") //Facebook token, we set it in the local storage at the profile.component.ts
  private nodeAPI: String = 'https://localhost:3000' //Basic URL to the API

    //Comun graphics variables
    public lineChartOptions: ChartOptions = { 
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
        }
      }
    };
    public lineChartLabels: Label[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    public lineChartType: ChartType = 'line'; //Type of graphic, in this cases are line graphics
    public lineChartLegend = true; //Variable to display the legend 
    public lineChartPlugins = [pluginDataLabels];
  
    //Recomendation based on profile views and engagements 
    public byProfileViewsEngagementsColor: Color[] = [
      {borderColor: 'rgba(77,83,96,1)',backgroundColor: 'rgba(77,83,96,0.2)'},
      { borderColor: 'red',backgroundColor: 'rgba(255,0,0,0.3)'}
    ]
    public byProfileViewsEngagementsData: any[] = [ //Variable that will containt the data for the Best day to post by profile views graphic
    ];
    public maxValuePVE: any //Variable that will containt the max value of the profile views graphic
    public dayValuePVE: String //Variable that will containt the day who has the max value of the profile views graphic
    public maxValueE: any //Variable that will containt the max value of the profile views graphic
    public dayValueE: String //Variable that will containt the day who has the max value of the profile views graphic
    public messagePVE: String

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user = this.authService.getcurrentUser()
    this.current.push(this.user) 
    this.getRecomendationForProfileViewsEngagements()
    console.log(this.instagramMedia)
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

  private getRecomendationForProfileViewsEngagements(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, we send the token, the ID and the media we requested
      in the /home route*/
      let API = this.nodeAPI+'/recomendations/engagements'
      let info = {
        socialyticId: this.user.id,
        fbToken: this.fbToken,
        media: this.instagramMedia
      }
      this.http.post(API.toString(), info).subscribe((response: any) => {
        let auxData = [
          response.probableEngagements.sunday,
          response.probableEngagements.monday,
          response.probableEngagements.tuesday,
          response.probableEngagements.wednesday,
          response.probableEngagements.thursday,
          response.probableEngagements.friday,
          response.probableEngagements.saturday
        ]
        this.byProfileViewsEngagementsData.push({ data: auxData, label: 'Probable Engagements' })
        this.maxValueE = response.maxValueEngagements
        this.dayValueE = this.getMaxValueDay(response.probableEngagements, this.maxValueE)

        auxData = [
          response.profileViews.sunday,
          response.profileViews.monday,
          response.profileViews.tuesday,
          response.profileViews.wednesday,
          response.profileViews.thursday,
          response.profileViews.friday,
          response.profileViews.saturday
        ]
        this.byProfileViewsEngagementsData.push({ data: auxData, label: 'Probable Profile Views' })
        this.maxValuePVE = response.maxValueProfileViews
        this.dayValuePVE = this.getMaxValueDay(response.profileViews, this.maxValuePVE)

        if(this.dayValueE != this.dayValuePVE){
          this.messagePVE = 'Your most engagement day is '+this.dayValueE+' but people enter to your profile the most is on '+ this.dayValuePVE+' we recommend you to publish on both day'
        }
        else{
          this.messagePVE = 'It seems you are doing pretty good, your most engagement day and your most profile views are on the same day! Keep posting the most on '+this.dayValueE
        }
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

}

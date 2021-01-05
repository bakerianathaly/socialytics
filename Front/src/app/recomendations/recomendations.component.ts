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
    { borderColor: 'red',backgroundColor: 'rgba(255,0,0,0.3)'},
    {borderColor: 'rgba(77,83,96,1)',backgroundColor: 'rgba(77,83,96,0.2)'}
  ]
  public byProfileViewsEngagementsData: any[] = [] //Variable that will containt the data for the Best day to post by profile views graphic
  public messageEngagements: String

  //Recomendation based on profile views and the number of post 
  public byProfileViewsAmountOfPostColor: Color[] = [
    { borderColor: 'rgb(180,93,151)',backgroundColor: 'rgb(228,197,218)'},
    {borderColor: 'rgba(77,83,96,1)',backgroundColor: 'rgba(77,83,96,0.2)'}
  ]
  public byProfileViewsAmountOfPostData: any[] = [] //Variable that will containt the data for the Best day to post by profile views graphic
  public messagePost: String 

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user = this.authService.getcurrentUser()
    this.current.push(this.user) 
    this.getRecomendationForProfileViewsEngagements()
    this.getRecomendationForProfileViewsAmountOfPost()
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

  //Recomendation between profile views and engagements
  private getRecomendationForProfileViewsEngagements(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, we send the token, the ID and the media we requested
      in the /home route*/
      let API = this.nodeAPI+'/recomendations/engagements'
      let info = { //Variable with the JSON that it will be send to the API endpoint 
        socialyticId: this.user.id,
        fbToken: this.fbToken,
        media: this.instagramMedia
      }
      this.http.post(API.toString(), info).subscribe((response: any) => {
        let auxData = [ //Auxiliar variable to transform the JSON data to an array to be push to the graphic data variable
          response.probableEngagements.sunday,
          response.probableEngagements.monday,
          response.probableEngagements.tuesday,
          response.probableEngagements.wednesday,
          response.probableEngagements.thursday,
          response.probableEngagements.friday,
          response.probableEngagements.saturday
        ]
        this.byProfileViewsEngagementsData.push({ data: auxData, label: 'Probable Engagements' })
        let dayValueEngagements = this.getMaxValueDay(response.probableEngagements, response.maxValueEngagements) //Variable that has the return (the day of the week) of the function call

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
        let dayValueProfileViews = this.getMaxValueDay(response.profileViews, response.maxValueProfileViews) //Variable that has the return (the day of the week) of the function call

        //We evaluated is both day are or aren't the same to initialize the message variable to make the recomendation to the user
        if(dayValueEngagements != dayValueProfileViews){
          this.messageEngagements = 'Your most engagement day is '+dayValueEngagements+' but people enter to your profile the most is on '+ dayValueProfileViews+' we recommend you to publish on both day'
        }
        else{
          this.messageEngagements = 'It seems you are doing pretty good, your most engagement day and your most profile views are on the same day! Keep posting the most on '+dayValueEngagements
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

  //Recomendation between profile views and the number of Post
  private getRecomendationForProfileViewsAmountOfPost(){
    if(this.fbToken && this.user.id){
      /*If we have the facebook token and the user ID we proceed to make the request to the API, we send the token, the ID and the media we requested
      in the /home route*/
      let API = this.nodeAPI+'/recomendations/amountofpost'
      let info = { //Variable with the JSON that it will be send to the API endpoint
        socialyticId: this.user.id,
        fbToken: this.fbToken,
        media: this.instagramMedia
      }
      this.http.post(API.toString(), info).subscribe((response: any) => {
        let auxData = [ //Auxiliar variable to transform the JSON data to an array to be push to the graphic data variable
          response.amountOfPictures.sunday,
          response.amountOfPictures.monday,
          response.amountOfPictures.tuesday,
          response.amountOfPictures.wednesday,
          response.amountOfPictures.thursday,
          response.amountOfPictures.friday,
          response.amountOfPictures.saturday
        ]
        this.byProfileViewsAmountOfPostData.push({ data: auxData, label: 'Number of Post' })
        let dayValueNumberPost = this.getMaxValueDay(response.amountOfPictures, response.maxValueAmountOfPicture) //Variable that has the return (the day of the week) of the function call

        auxData = [
          response.profileViews.sunday,
          response.profileViews.monday,
          response.profileViews.tuesday,
          response.profileViews.wednesday,
          response.profileViews.thursday,
          response.profileViews.friday,
          response.profileViews.saturday
        ]
        this.byProfileViewsAmountOfPostData.push({ data: auxData, label: 'Probable Profile Views' })
        let dayValueProfileViews = this.getMaxValueDay(response.profileViews, response.maxValueProfileViews) //Variable that has the return (the day of the week) of the function call

        //We evaluated is both day are or aren't the same to initialize the message variable to make the recomendation to the user
        if(dayValueNumberPost != dayValueProfileViews){
          this.messagePost = 'You have been posting more on '+dayValueNumberPost+', but people enter to your profile the most is on '+ dayValueProfileViews+'. We recommend to star posting more on '+dayValueProfileViews
        }
        else{
          this.messagePost = 'It seems you are doing pretty good, you are posting the most at same day your profile is having more views! Keep posting the most on '+dayValueNumberPost
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

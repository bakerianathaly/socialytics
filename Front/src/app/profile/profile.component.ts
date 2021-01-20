import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public fbToken: String = localStorage.getItem("FB_ACCESS_TOKEN") 
  public fbExpiredToken: String = localStorage.getItem("FB_EXPIRES_IN") 
  private nodeAPI: String = 'https://localhost:3000' //Basic URL to the API
  private user: User
  private current:Array<User>=[];
  public instagramData: any //Basic user instagram data
  public instagramMedia: any //First 25 pictures of the user
  public topMediaPost: any  //Media information for the top 5 media post

  //Comun graphics variables
  public ChartOptions: ChartOptions = { 
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
          labelString: 'Quantity of the values',
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
        color: 'black'
      }
    },
    legend: {
      display: true,
      labels: {
        fontColor: 'black'
      }
    }
  };
  public ChartLabels: Label[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  public ChartLegend = true; //Variable to display the legend 
  public ChartPlugins = [pluginDataLabels];

  //Follower count graphics variables 
  public barChartType: ChartType = 'bar'; //Type of graphic, in this cases is a bar  graphics
  public followerCountColor: Color[] = [
    {backgroundColor: 'rgb(251,203,84)'},
    {backgroundColor: 'rgb(251,119,84)'},
    {backgroundColor: 'rgb(180,93,151)'},
    {backgroundColor: 'rgb(152,70,84)'}
  ]
  public followerCountData: any[] = [] //Variable that will containt the data for the Best day to post by profile views graphic
  public changeFollowers: any

  //Frequency type of post graphics variables
  public doughnutChartOptions: ChartOptions = { 
    responsive: true,
    legend: {
      display: true,
      labels: {
        fontColor: 'black'
      }
    },
    plugins: {
      datalabels: {
        color: "black",
        formatter: (value, ctx) => {
          var perc = value + "%";
          return perc;
        }
      }
    }
  };
  public doughnutChartLabels: Label[] = ["Image", "Video", "Carousel Album"];
  public doughnutChartData: MultiDataSet =  [];
  public doughnutChartType: ChartType = 'doughnut';
  public donutColors=[{
      backgroundColor: [
        'rgb(255,167,182)',
        'rgb(117,187,255)',
        'rgb(255,209,117)'
      ]
    }
  ];

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.user=this.authService.getcurrentUser()
    this.current.push(this.user) 
    console.log('[TOKEN]', this.fbToken)
    Swal.fire({
      icon: 'warning',
      title: 'Welcome to Socialytics.',
      text: 'Obtaining and processing your information. This may take a few minutes, please be patient.',
      showConfirmButton: false,
      timer: 25000
    })
    this.getInstagramData()
    this.getMedia()
    this.getFollowerCount()
  }

  protected getInstagramData(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/instagram/statistics?fbToken='+this.fbToken+'&socialyticsId='+this.user.id
  
    this.http.get(nodeAPI.toString()).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.instagramData = response.instagram.userData
      localStorage.setItem("INSTAGRAM_DATA", JSON.stringify(this.instagramData))
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
  }

  protected getMedia(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/instagram/getmedia?fbToken='+this.fbToken+'&socialyticId='+this.user.id
  
    this.http.get(nodeAPI.toString()).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.instagramMedia = response.allMediaInfo
      localStorage.setItem("INSTAGRAM_MEDIA", JSON.stringify(this.instagramMedia))
      this.getFrequencyPostType()
      this.getTop5MediaPost()
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
    
  }

  protected getFollowerCount(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/intstagram/newFollowers'
    // let info = { //Variable with the JSON that it will be send to the API endpoint 
    //   socialyticId: this.user.id,
    //   fbToken: this.fbToken
    // }

    let info = {
      data: [
        {
          value: 0,
          end_time: "2020-11-01T07:00:00+0000"
        },
        {
            value: 3,
            end_time: "2020-11-02T08:00:00+0000"
        },
        {
            value: 21,
            end_time: "2020-11-03T08:00:00+0000"
        },
        {
            value: 3,
            end_time: "2020-11-04T08:00:00+0000"
        },
        {
            value: 4,
            end_time: "2020-11-05T08:00:00+0000"
        },
        {
            value: 2,
            end_time: "2020-11-06T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-07T08:00:00+0000"
        },
        {
            value: 1,
            end_time: "2020-11-08T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-09T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-10T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-11T08:00:00+0000"
        },
        {
            value: 43,
            end_time: "2020-11-12T08:00:00+0000"
        },
        {
            value: 4,
            end_time: "2020-11-13T08:00:00+0000"
        },
        {
            value: 2,
            end_time: "2020-11-14T08:00:00+0000"
        },
        {
            value: 4,
            end_time: "2020-11-15T08:00:00+0000"
        },
        {
            value: 5,
            end_time: "2020-11-16T08:00:00+0000"
        },
        {
            value: 10,
            end_time: "2020-11-17T08:00:00+0000"
        },
        {
            value: 1,
            end_time: "2020-11-18T08:00:00+0000"
        },
        {
            value: 1,
            end_time: "2020-11-19T08:00:00+0000"
        },
        {
            value: 1,
            end_time: "2020-11-20T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-21T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-22T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-23T08:00:00+0000"
        },
        {
            value: 0,
            end_time: "2020-11-24T08:00:00+0000"
        },
        {
            value: 34,
            end_time: "2020-11-25T08:00:00+0000"
        },
        {
            value: 12,
            end_time: "2020-11-26T08:00:00+0000"
        },
        {
            value: 4,
            end_time: "2020-11-27T08:00:00+0000"
        },
        {
            value: 3,
            end_time: "2020-11-28T08:00:00+0000"
        },
        {
            value: 6,
            end_time: "2020-11-29T08:00:00+0000"
        },
        {
            value: 12,
            end_time: "2020-11-30T08:00:00+0000"
        }
      ]
    }

    this.http.post(nodeAPI.toString(), info).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.changeFollowers = {
        total: response.totalChangeFollowers,
        avg: response.avgChange,
        max: response.maxOfEachWeek,
        min: response.minOfEachWeek
      }
      this.followerCountData.push({ data: response.week1, label: 'Week number 1'})
      this.followerCountData.push({ data: response.week2, label: 'Week number 2'})
      this.followerCountData.push({ data: response.week3, label: 'Week number 3'})
      this.followerCountData.push({ data: response.week4, label: 'Week number 4'})
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
  }

  protected getFrequencyPostType(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/instagram/typeMediaFrequency'
    let info = { //Variable with the JSON that it will be send to the API endpoint 
      socialyticId: this.user.id,
      media: this.instagramMedia
    }

    this.http.post(nodeAPI.toString(), info).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      instagramData variable to use it in the profile.component.html*/
      this.doughnutChartData = [response.typePostFrequencyPercent]
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
  }

  protected getTop5MediaPost(){
    //Here we initialize the URL to make the request to get te info, we initialize it with the token and the user id
    let nodeAPI = this.nodeAPI+'/instagram/topMediaPost'
    let info = { //Variable with the JSON that it will be send to the API endpoint 
      socialyticId: this.user.id,
      media: this.instagramMedia
    }

    this.http.post(nodeAPI.toString(), info).subscribe((response: any) => {
      /*If there is none error, we set it again, set the
      top media post variable to use it in the profile.component.html*/
      this.topMediaPost = response.Top5MediaPost
    }, error => {
      //If there is any error (such as bad request or a problem with the token) it swal an error and logout the user
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message
      })
      this.authService.logout()
      this.router.navigate(['/'])
    });
  }

  public logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

  public getTopInfo(media: any){
    Swal.fire({
      imageUrl: media.mediaInfo.media_url,
      html:
        '<i class="fa fa-heart" aria-hidden="true" title="Likes"></i>' + media.mediaInfo.like_count + '   ' + '   ' +
        '<i class="fa fa-comments" aria-hidden="true" title="Comments"></i>' + media.mediaInfo.comments_count + '   ' + '   ' +
        '<i class="fa fa-users" aria-hidden="true" title="Engagements"></i>' + media.totalEngagementPost + '</br>'+ '</br>' +
        media.mediaInfo.caption
      ,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false
    })
  }

}

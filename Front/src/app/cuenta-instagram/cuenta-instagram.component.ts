import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-instagram',
  templateUrl: './cuenta-instagram.component.html',
  styleUrls: ['./cuenta-instagram.component.css']
})
export class CuentaInstagramComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.facebookConfig()
  }

  public facebookConfig(){
    console.log(this.router.url)
  }
}

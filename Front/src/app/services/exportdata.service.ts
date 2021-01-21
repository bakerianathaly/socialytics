import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable()

export class ExportdataService {
  
 constructor() { }
   
  generatePDF(DivId){
    let timerInterval
    Swal.fire({
      title: 'Welcome to Socialytics.',
      html: 'Your download will start in <strong></strong> seconds.',
      timer:5000,
      timerProgressBar: true,
      didOpen:() => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('strong')
            if (b) {
              b.textContent =(Swal.getTimerLeft()/1000).toFixed(0)
            }
          }
        },100)
      },
      willClose:() => {
        clearInterval(timerInterval)
      }
    }).then(()=> {

        let data=document.getElementById(DivId)
    })
      
  }


}


      
    
   
   
    




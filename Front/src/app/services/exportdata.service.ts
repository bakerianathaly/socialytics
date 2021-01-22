import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
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
        let options={
          scrollX: -window.scrollX,
          scrollY: -window.scrollY
        }

        html2canvas(data,options).then(function(canvas) {
          console.log(canvas.width)
          let img = canvas.toDataURL()
          let pdfDoc = {
            content: [{
              image: img
              }
              
            ],
            pageOrientation: 'portrait',
            pageMargins: [ 40, 60, 40, 60 ],
            pageSize: {
              width: 2450,
              height: 'auto'
            }
             
          }
          pdfMake.createPdf(pdfDoc).download('Report.pdf')
          
        })
    
    })
      
  }


}


      
    
   
   
    




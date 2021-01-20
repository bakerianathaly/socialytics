import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
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
        }, 100)
      },
      willClose:() => {
        clearInterval(timerInterval)
      }
    }).then(()=> {

      console.log(DivId)
      let data=document.getElementById(DivId)
      console.log(data)
      let doc = new jsPDF('p', 'pt', 'a4')
      let options={
        // Opciones
        background: 'white',
        // Calidad del PDF
        scale: 1
      }
    
      html2canvas(data,options).then(function(canvas) {
        
        let bufferX = 15
        let bufferY = 18
        let img = canvas.toDataURL("image/png")
        let imgProps = (doc as any).getImageProperties(img);
        let pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img,'PNG',bufferX,bufferY,pdfWidth, pdfHeight, undefined, 'FAST')
        doc.save('Report.pdf')
      })
    })
  }
}
      
    
   
   
    




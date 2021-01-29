import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import pptxgen from "pptxgenjs";
import Swal from 'sweetalert2';

// Excel global variables
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'


@Injectable()

export class ExportdataService {
  
  constructor() { }
  // Function to generate Pdf 
  generatePDF(DivId){
    // Message displays after clicking the event.
    let timerInterval
    Swal.fire({
      title: 'Welcome to Socialytics',
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
        // Get the div id 
        let data=document.getElementById(DivId)
        // Options to avoid images from being cut off.
        let options={
          scrollX: -window.scrollX,
          scrollY: -window.scrollY
        }
        // It converts the Html to an image in base 64 and then creates the Pdf through Pdfmake.
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
          pdfMake.createPdf(pdfDoc).download(DivId + '.pdf')
          
        })
    
    })
      
  }
  // function to generate the excel file
  generateExcel(json:any[],DivId){

    // Message displays after clicking the event.
    let timerInterval
    Swal.fire({
      title: 'Welcome to Socialytics',
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

      let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
      let workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      let excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer,DivId);
      
    })
    
  }
  // Function to save the excel file
  private saveAsExcelFile(buffer: any,DivId): void {
    
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, DivId + EXCEL_EXTENSION);
    
  }
   
  // Function to generate powerPoint

  generatePPT(DivId){

    let timerInterval
    Swal.fire({
      title: 'Welcome to Socialytics',
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

      // Get the div id 
      let data=document.getElementById(DivId)
      // Options to avoid images from being cut off.
      let options={
        scrollX: -window.scrollX,
        scrollY: -window.scrollY
      }

      // It converts the Html to an image in base 64 and then creates the Pdf through Pdfmake.
      html2canvas(data,options).then(function(canvas) {
        let img = canvas.toDataURL()
        // 1. Create a new Presentation
        let pres = new pptxgen()
        // 2. Add a Slide
        let slide = pres.addSlide()
        // 3. Image by data (pre-encoded base64)
        slide.addImage({data:img, x:1, y: 1, w:'75%' , h:'75%'})
        // 4. Save the Presentation
        pres.writeFile(DivId + '.pptx')

      })

    })

  }

}  


      
    
   
   
    




import { Component,ViewChild  } from '@angular/core';
import {ReadCSV} from './SharedService';
import {minimalIssuePipe } from './minimalIssuePipe';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';

import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ReadCSV,minimalIssuePipe]
})
export class AppComponent {

  //Declarations
  title = 'UploadCSV';
  @ViewChild('csvFile') csvFileReader: any; 
  public csvRecords: any[] = []; 
  svcReadCSV:ReadCSV;
  Header:any=[];
  IsValidData:boolean;
  txtFtrMinIssueCnt:number=null;
  staticHeader:any[]=['First Name','Sur Name','Issue Count','Date of birth'] 

  //Default Template For Download
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: false,
    title: '',
    useBom: true,
    noDownload: false,
    headers: this.staticHeader
  };

  constructor( private _ReadCSV:ReadCSV,private toastr:ToastrService){
    this.svcReadCSV=_ReadCSV;
  }

  onFileSelect($event: any): void { 
    this.txtFtrMinIssueCnt=null
    this.IsValidData=false;  
    let files = $event.srcElement.files;  
      //File format validation
      if (this.isValidCSVFile(files[0])) {  
        //File Size validation
        if(this.isValidSize(files[0])) {  
          this.toastr.error('Kindly upload a smaller file, max size is 10 MB');
          return;
        }
        let input = $event.target;  
        let reader = new FileReader();  
        reader.readAsText(input.files[0]);  
        reader.onload = () => {  
          let csvData = reader.result;  

          //Fetch Header from CSV File 
          let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
          this.Header = this.svcReadCSV.getHeader(csvRecordsArray);  
          if(!isNullOrUndefined(this.Header) && this.Header.length>0){
          var upperCaseNames = this.Header.map(function(value) {
            return value.toUpperCase().replace(/\ /g,'');
          });

          //Header Validation starts
          let ValidHeaders=0;
          for(let i =0;i<this.staticHeader.length;i++){
            ValidHeaders=upperCaseNames.indexOf(this.staticHeader[i].toUpperCase().replace(/\ /g,''))==-1 ? 1 : 0;
            if(ValidHeaders==1)
            {
              this.toastr.error('Upload csv does not contain the valid headers'); 
              return false; 
            }
          }
          //Header Validation Ends

          //Fetch data from CSV File 
          this.csvRecords = this.svcReadCSV.getRecordsFromCSV(csvRecordsArray, this.Header.length);  
          //Show/Hide  based on data count
          this.IsValidData=this.csvRecords.length>0?true:false;
          if(this.IsValidData == false) this.toastr.warning('Uploaded csv file does not contain any data to display'); 
        }
        else{
          this.toastr.warning('Uploaded csv file is empty'); 
        } 
      } 
    
        reader.onerror = function () {  
          console.log('error is occured while reading file!');  
        };  
    
      } else {  
        this.toastr.error('Please import valid .csv file.');  
        this.FileReset();  
      }  
    }  

    //File type validation
    isValidCSVFile(file: any) {  
      return file.name.endsWith(".csv");  
    } 
    //File Size validation
    isValidSize(file: any){
      return file.size >= 10485760 ? true:false;
    }

    //Reset all the elements & array
    FileReset(){
      this.csvFileReader.nativeElement.value = "";  
      this.Header = [];  
      this.IsValidData = false;
      this.txtFtrMinIssueCnt=null
      this.csvRecords = [];
    }

    //Download default CSV template
    DownloadTemplate(){
    new AngularCsv([], "DefaultCSV", this.csvOptions);
    }
}

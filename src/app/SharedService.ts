import { Injectable } from '@angular/core';
import {CSVRecord} from './CSVDataModel'
@Injectable()
/**
 *  class ReadCSV
 * 
 */
export class ReadCSV{

constructor(){}

//To get the header from the uploaded csv file
getHeader(csvHeaderRec: any) :any[]{  
    let headers = (<string>csvHeaderRec[0]).replace(/\"/g, '').split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  } 
  
  //To get the data from the uploaded csv file
  getRecordsFromCSV(csvDataRec: any, headerLength: any) :any[]{  
    let csvArr = [];  
    for (let i = 1; i < csvDataRec.length; i++) {  
      let currentRec = (<string>csvDataRec[i]).replace(/\"/g, '').split(',');  
      if (currentRec.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.FirstName = currentRec[0].trim();  
        csvRecord.SurName = currentRec[1].trim();  
        csvRecord.IssueCount = currentRec[2].trim();  
        csvRecord.Dateofbirth = currentRec[3].trim();  
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }  
    
}

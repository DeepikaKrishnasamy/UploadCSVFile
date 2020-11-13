import { Pipe,PipeTransform } from '@angular/core';

@Pipe({ name: 'minimalIssue' })
export class minimalIssuePipe implements PipeTransform  {
  transform(data: any[], min: number) { 
    if(data!=undefined && min!=undefined){
    return data.filter(data => (data.IssueCount <= min));
    }
    return data; 
  }
}
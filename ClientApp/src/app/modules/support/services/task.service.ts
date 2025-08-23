import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DevExtremeParam, JobForUserParam } from '../../admin/models/search.Model';
import { USP_Query_FormTasksByStatusResult } from '../models/assignedTask.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http : HttpClient
  ) { }

  getUserTask(param : DevExtremeParam<JobForUserParam>){
    return this.http.post(`${environment.apiUrl}IssueInform/queryTask-user` ,param)
  }


  taskManagement(param : USP_Query_FormTasksByStatusResult , status : string){
    return this.http.post(`${environment.apiUrl}IssueInform/TaskManagement/${status}`,param)
  }

   listTaskManagement(param : Array<USP_Query_FormTasksByStatusResult> , status : string){
    return this.http.post(`${environment.apiUrl}IssueInform/ListTaskManagement/${status}`,param)
  }


  
}

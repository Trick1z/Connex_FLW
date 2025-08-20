import { Injectable } from '@angular/core';
import {  InformTask, TaskRequest, ValidatedDate } from '../models/inform.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformTaskService {

  constructor(
    private http: HttpClient
  ) { }


  validateInformTask(data: ValidatedDate) {
    return this.http.post<any[]>(`${environment.apiUrl}IssueInform/ValidateTask`, data)
  }
  saveInformTask(data: TaskRequest,status :string) {
    return this.http.post(`${environment.apiUrl}IssueInform/SaveIssueForm/${status}`, data)
  }

  // finalValidateInformTask(data: InformTask[] , status :string) {
  //   return this.http.post(`${environment.apiUrl}IssueInform/FinalValidateTaskItem/${status}`, data)
  // }
}

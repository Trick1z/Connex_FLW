import { Injectable } from '@angular/core';
import {   QueryUserForm, QueryUserFormDetail, TaskRequest, USP_Query_IssueFormsResult, ValidatedItem } from '../models/inform.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';
import { DevExtremeNoneClassParam, DevExtremeParam } from '../../admin/models/search.Model';

@Injectable({
  providedIn: 'root'
})
export class InformTaskService {

  constructor(
    private http: HttpClient
  ) { }


  validateInformTask(data: ValidatedItem , formId :number) {
    return this.http.post<any[]>(`${environment.apiUrl}IssueInform/SaveTask`, data)
  }
  DeleteTask(data: ValidatedItem ) {
    return this.http.post<any[]>(`${environment.apiUrl}IssueInform/DeleteTask`, data)
  }
  saveInformTask(data: TaskRequest,status :string) {
    return this.http.post(`${environment.apiUrl}IssueInform/SaveIssueForm/${data.formId}/${status}`, data)
  }
  closeInformTask(data: USP_Query_IssueFormsResult) {
    return this.http.post(`${environment.apiUrl}IssueInform/CloseIssueForm`, data)
  }

  getInformTaskById(formId : number ){
    return this.http.get(`${environment.apiUrl}IssueInform/GetIssueForm/${formId}`)
  }

  getUnsuccessInform(param : DevExtremeParam<QueryUserForm> , formStatus : string ){

    return this.http.post(`${environment.apiUrl}IssueInform/queryIssueforms/unsuccess/${formStatus}`,param)

  }

   getUnsuccessInformDetail(param : DevExtremeParam<QueryUserFormDetail> ){

    return this.http.post(`${environment.apiUrl}IssueInform/queryIssueforms/unsuccessTaskDetail`,param)

  }




}

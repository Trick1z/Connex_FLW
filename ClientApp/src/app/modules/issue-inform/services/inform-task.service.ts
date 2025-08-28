import { Injectable } from '@angular/core';
import {   QueryUserForm, QueryUserFormDetail, TaskLogParam, TaskRequest, USP_Query_IssueFormsResult, ValidatedItem } from '../models/inform.model';
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


  validateInformTask(param: ValidatedItem , formId :number) {
    return this.http.post<any[]>(`${environment.apiUrl}IssueInform/SaveTask`, param)
  }
  DeleteTask(param: ValidatedItem ) {
    return this.http.post<any[]>(`${environment.apiUrl}IssueInform/DeleteTask`, param)
  }
  saveDraftInformTask(param: TaskRequest) {
    return this.http.post(`${environment.apiUrl}IssueInform/SaveDraftIssueForm/${param.formId}`, param)
  }
  saveSubmitInformTask(param: TaskRequest) {
    return this.http.post(`${environment.apiUrl}IssueInform/SaveSubmitIssueForm/${param.formId}`, param)
  }


  deleteInformTask(param: USP_Query_IssueFormsResult) {
    return this.http.post(`${environment.apiUrl}IssueInform/DeleteForm`, param)
  }

  closeInformTask(param: USP_Query_IssueFormsResult) {
    return this.http.post(`${environment.apiUrl}IssueInform/CloseIssueForm`, param)
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

  queryTaskLog(param :TaskLogParam ){
    return this.http.post(`${environment.apiUrl}IssueInform/QueryTaskLog`,param)
  }

}

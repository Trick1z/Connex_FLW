import { Injectable } from '@angular/core';
import {   QueryUserForm, TaskRequest, USP_Query_IssueFormsResult, ValidatedItem } from '../models/inform.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';
import { DevExtremeParam } from '../../admin/models/search.Model';

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

  getInformTaskById(formId : number ){
    return this.http.get(`${environment.apiUrl}IssueInform/GetIssueForm/${formId}`)
  }

  getUnsuccessInform(param : DevExtremeParam<QueryUserForm>){

    return this.http.post(`${environment.apiUrl}IssueInform/queryIssueforms/unsuccess`,param)

  }




}

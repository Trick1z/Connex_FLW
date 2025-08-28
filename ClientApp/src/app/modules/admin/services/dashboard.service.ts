import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DevExtremeParam, OverallDetailParam, Search } from '../models/search.Model';
import { environment } from 'src/environments/environment';
import { QueryLogEnquiryParam } from '../../issue-inform/models/inform.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  queryWorkLoad(data: DevExtremeParam<Search>) {

    return this.http.post(`${environment.apiUrl}DashBoard/QueryUserWorkLoad`, data)
  }

  queryOverallFormStatus() {

    return this.http.get(`${environment.apiUrl}DashBoard/QueryOverallFormStatus`)
  }

  queryOverallFormStatusDetail(data: DevExtremeParam<OverallDetailParam>) {

    return this.http.post(`${environment.apiUrl}DashBoard/QueryOverallFormStatusDetail`, data)
  }

  queryLogEnquiry(data: DevExtremeParam<QueryLogEnquiryParam>) {
    return this.http.post(`${environment.apiUrl}DashBoard/QueryLogEnquiry`, data)
  }
}
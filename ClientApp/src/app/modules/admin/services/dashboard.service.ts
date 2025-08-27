import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DevExtremeParam, Search } from '../models/search.Model';
import { environment } from 'src/environments/environment';

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
}

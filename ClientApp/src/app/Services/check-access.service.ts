import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckAccessService {

  constructor(
    private http : HttpClient
  ) { }


  CheckAccess(path :string) {
    return this.http.post(`${environment.apiUrl}Authentication/check-access`, { pageUrl:`/${ path }`})
  }

}

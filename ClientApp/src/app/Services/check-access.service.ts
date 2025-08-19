import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckAccessService {

  constructor(
    private http : HttpClient
  ) { }


  onCheckAccess(path :string) {
    return this.http.post('/api/check-access', { pageUrl:`/${ path }`})
  }

}

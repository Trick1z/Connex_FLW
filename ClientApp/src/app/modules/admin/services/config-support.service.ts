import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserMapCategoriesViewModel } from '../models/tag-option.model';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ConfigSupportService {


  constructor(private http: HttpClient) { }

  insertMappingUserCategories(param: UserMapCategoriesViewModel) {
    return this.http.post(`${environment.apiUrl}ConfigSupport/InsertMappingUserCategories`, param)
  }
  getCategoriesForUser(id: number) {
    return this.http.get<UserMapCategoriesViewModel>(`${environment.apiUrl}ConfigSupport/loadUser/${id}`)
  }

  getUserByRoleSupport() {
    return this.http.get(`${environment.apiUrl}ConfigSupport/userByRole`)

  }
  queryUserByText(loadOptions: any) {

    return this.http.post(`${environment.apiUrl}ConfigSupport/queryUserByText`, loadOptions)
  }

}

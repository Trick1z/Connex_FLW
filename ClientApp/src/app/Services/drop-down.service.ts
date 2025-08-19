import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DropDownList } from '../modules/admin/models/tag-option.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropDownService {

  constructor(private http: HttpClient) { }
    // private baseUrl = 'https://localhost:7070/';


  getUserMapCategoriesDropDown() {

    return this.http.get<DropDownList[]>(`${environment.apiUrl}DropDown/userMapCategoriesByUserId`)

  }


  getCategoriesMapProductDropDown(){
    return this.http.get<DropDownList[]>(`${environment.apiUrl}DropDown/CategoriesMapProductDropDown`)
  }

  getCategoryDropDown(){

    return this.http.get(`${environment.apiUrl}IssueProduct/Categories/item`)
  }

  getProductDropDown(){

    return this.http.get(`${environment.apiUrl}IssueProduct/Products/item`)
  }

  getRoleDropDownItem(){


    return this.http.get(`${environment.apiUrl}/DropDown/role`)
  }


}



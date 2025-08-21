import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DropDownList } from '../models/dropDown.model';

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

    return this.http.get(`${environment.apiUrl}DropDown/CategoriesItem`)
  }

  getProductDropDown(){

    return this.http.get(`${environment.apiUrl}DropDown/ProductsItem`)
  }

  getRoleDropDownItem(){


    return this.http.get(`${environment.apiUrl}/DropDown/role`)
  }

  getProductMapByCategories(id: number){

    return this.http.get(`${environment.apiUrl}DropDown/ProductMapByCategories/${id}`)
  }


}



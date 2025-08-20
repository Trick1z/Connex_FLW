import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { categoriesMapProductViewModel } from '../models/tag-option.model';
import { InsertCategoriesDataModel, InsertProductDataModel } from '../models/insert-categories.model';
import { CategoriesDeleteFormData, ProductDeleteFormData } from '../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class IssueProductService {

  constructor(
    private http: HttpClient
  ) { }


  getViewProductDetail(id: number) {

    return this.http.get(`${environment.apiUrl}IssueProduct/LoadCategories/${id}`)

  }


  onProductSaveData(param: categoriesMapProductViewModel) {
    return this.http.post(`${environment.apiUrl}IssueProduct/SaveIssueMapProduct`, param)
  }



  getProductsForCategory(id: number) {
    return this.http.get(`${environment.apiUrl}IssueProduct/LoadCategories/${id}`)

  }

  onSaveCategories(param: InsertCategoriesDataModel) {
    return this.http.post(`${environment.apiUrl}IssueProduct/SaveCategories`, param)
  }
  onSaveProduct(param: InsertProductDataModel) {
    return this.http.post(`${environment.apiUrl}IssueProduct/SaveProduct`, param)
  }

  onDeleteCategories(param: CategoriesDeleteFormData) {

    return this.http.post(`${environment.apiUrl}IssueProduct/DeleteCategories`, param)
  }
  onDeleteProduct(param: ProductDeleteFormData) {

    return this.http.post(`${environment.apiUrl}IssueProduct/DeleteProduct`, param)
  }

  onUpdateProduct(param: any) {

    return this.http.post(`${environment.apiUrl}IssueProduct/UpdateProduct`, param)
  }
  onUpdateCategories(param: any) {

    return this.http.post(`${environment.apiUrl}IssueProduct/UpdateCategories`, param)
  }

  // query
  queryCategoriesByText(loadOptions: any) {

    return this.http.post(`${environment.apiUrl}IssueProduct/QueryCategoriesByText`, loadOptions)
  }
  QueryProductOnCategories(loadOptions: any) {

    return this.http.post(`${environment.apiUrl}IssueProduct/QueryProductOnCategories`, loadOptions)
  }

}

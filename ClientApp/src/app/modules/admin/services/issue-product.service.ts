import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { categoriesMapProductViewModel } from '../models/tag-option.model';
import { CategoriesDeleteFormData, CategoriesParam, ProductDeleteFormData, ProductParam } from '../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class IssueProductService {

  constructor(private http: HttpClient) { }

  getViewProductDetail(id: number) {
    return this.http.get(`${environment.apiUrl}IssueProduct/LoadCategories/${id}`);
  }

  getProductsForCategory(id: number) {
    return this.http.get(`${environment.apiUrl}IssueProduct/LoadCategories/${id}`);
  }

  onProductSaveData(param: categoriesMapProductViewModel) {
    return this.http.post(`${environment.apiUrl}IssueProduct/SaveIssueMapProduct`, param);
  }

  onDeleteCategories(param: CategoriesDeleteFormData) {
    return this.http.post(`${environment.apiUrl}IssueProduct/DeleteCategories`, param);
  }

  onDeleteProduct(param: ProductDeleteFormData) {
    return this.http.post(`${environment.apiUrl}IssueProduct/DeleteProduct`, param);
  }

  queryCategoriesByText(loadOptions: any) {
    return this.http.post(`${environment.apiUrl}IssueProduct/QueryCategoriesByText`, loadOptions);
  }

  queryProductOnCategories(loadOptions: any) {
    return this.http.post(`${environment.apiUrl}IssueProduct/QueryProductOnCategories`, loadOptions);
  }

  categoriesManagement(data: CategoriesParam) {
    return this.http.post(`${environment.apiUrl}IssueProduct/CategoriesManagement`, data);
  }

  productManagement(data: ProductParam) {
    return this.http.post(`${environment.apiUrl}IssueProduct/ProductManagement`, data);
  }

  getCategoriesItems() {
    return this.http.get(`${environment.apiUrl}IssueProduct/GetIssueCategoriesItem`)
  }

  deleteProductItems(data:ProductParam) {
    return this.http.post(`${environment.apiUrl}IssueProduct/DeleteProduct`,data)
  }

  deleteCategoriesItems(data:CategoriesParam) {
    return this.http.post(`${environment.apiUrl}IssueProduct/DeleteCategories`,data)
  }
}

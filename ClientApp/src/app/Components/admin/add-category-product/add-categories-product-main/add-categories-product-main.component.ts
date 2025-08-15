import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api-service.service';
import { InsertCategoriesDataModel, InsertProductDataModel } from '../../master/model/insert-categories.model';
import { categoriesDeleteFormData, CategoriesUpdateFormData, ProductDeleteFormData, ProductUpdateFormData } from 'src/app/Components/models/categories.model';

@Component({
  selector: 'app-add-categories-product-main',
  templateUrl: './add-categories-product-main.component.html',
  styleUrls: ['./add-categories-product-main.component.scss']
})
export class AddCategoriesProductMainComponent implements OnInit {
  ngOnInit(): void {
    this.getCategoriesProductDataList();
  }

  constructor(
    private api: ApiService
  ) { }
  // popup
  categoryVisible: boolean = false;
  productVisible: boolean = false;
  // valiavble
  categoryTextValue: string = "";
  productTextValue: string = "";
  isProgram: boolean = false;

  categoryDataList: Array<any> = [];
  productDataList: Array<any> = [];

  // editdata

  editProductVisible: boolean = false;
  editProductText: string = "";


  // popup state
  categoryPopupShow() {
    this.categoryVisible = true;
  }
  productPopupShow() {
    this.productVisible = true;
  }


  categoryPopupHide() {
    this.categoryVisible = false;
    this.categoryTextValue = ''
    this.isProgram = false;

  }
  productPopupHide() {
    this.productVisible = false;
    this.productTextValue = ''

  }

  onTextValueChanged(e: any) {
    this.categoryTextValue = e.value;
  }
  onProductTextValueChanged(e: any) {
    this.productTextValue = e.value;
  }



  testLog() {

    console.log(this.categoryTextValue,
      this.isProgram);
    console.log(this.productTextValue);

  }


  getCategoriesProductDataList() {

    this.api.get("api/IssueProduct/Categories/item").subscribe((res: any) => {


      this.categoryDataList = res
    })

    this.api.get("api/IssueProduct/Products/item").subscribe((res: any) => {


      this.productDataList = res
    })

  }


  onCategoriesSubmit() {

    var data: InsertCategoriesDataModel = {
      IssueCategoriesName: this.categoryTextValue,
      isProgramIssue: this.isProgram

    }

    this.api.post('api/IssueProduct/SaveCategories', data).subscribe((res: any) => {

      console.log(res);

      this.getCategoriesProductDataList();

      return this.categoryPopupHide()
    })
  }

  onProductSubmit() {

    var data: InsertProductDataModel = {
      productName: this.productTextValue,

    }

    this.api.post('api/IssueProduct/SaveProduct', data).subscribe((res: any) => {
      console.log(res);

      this.getCategoriesProductDataList();

      return this.productPopupHide()


    })
  }


  onDeleteCategory(data: categoriesDeleteFormData) {

    var newData: categoriesDeleteFormData = {
      issueCategoriesId: data.issueCategoriesId,
      issueCategoriesName: data.issueCategoriesName,
    }


    this.api.post(`api/IssueProduct/DeleteCategories`, newData).subscribe((res: any) => {

      console.log(res);
      this.getCategoriesProductDataList();
    });


  }

  onDeleteProduct(data: ProductDeleteFormData) {

    var newData: ProductDeleteFormData = {
      productId: data.productId,
      productName: data.productName,

    }


    this.api.post(`api/IssueProduct/DeleteProduct`, newData).subscribe((res: any) => {

      console.log(res);
      this.getCategoriesProductDataList();
    });


  }


  editProductFormData: ProductUpdateFormData = {
    productId: 0,
    productName: "",
  }


  onEditProductPopupShow(data: ProductUpdateFormData) {
    this.editProductVisible = true;
    this.editProductText = data.productName;

    this.editProductFormData.productId = data.productId
    this.editProductFormData.productName = this.editProductText,

      console.log(this.editProductFormData);


  }


  onEditProductPopupHide() {
    this.editProductVisible = false;
    this.editProductFormData = {
      productId: 0,
      productName: "",
    }
  }

  onEditPopupSubmit() {

    var newData = {
      productId: this.editProductFormData.productId,
      productName: this.editProductText
    }


    this.api.post("api/IssueProduct/UpdateProduct", newData).subscribe((res: any) => {
      console.log(res);
      this.onEditProductPopupHide();
      this.getCategoriesProductDataList();
    })

    // console.log(this.editFormData);

  }


  editCategoriesVisible: boolean = false;
  editCategoriesText: string = "";

  editCategoriesFormData: CategoriesUpdateFormData = {
    issueCategoriesId: 0,
    issueCategoriesName: "",
    isProgramIssue: false
  }


  onEditCategoriesPopupShow(data: CategoriesUpdateFormData) {
    this.editCategoriesVisible = true;
    this.editCategoriesText = data.issueCategoriesName;

    this.editCategoriesFormData.issueCategoriesId = data.issueCategoriesId
    this.editCategoriesFormData.issueCategoriesName = this.editCategoriesText,
      this.editCategoriesFormData.isProgramIssue = data.isProgramIssue

    // console.log(this.editCategoriesFormData);


  }


  onEditCategoriesPopupHide() {
    this.editCategoriesVisible = false;

    this.editCategoriesFormData = {
      issueCategoriesId: 0,
      issueCategoriesName: "",
      isProgramIssue: false
    }

  }

  onEditCategoriesPopupSubmit() {

    var newData = {
      issueCategoriesId: this.editCategoriesFormData.issueCategoriesId,
      issueCategoriesName: this.editCategoriesText,
      isProgramIssue: this.editCategoriesFormData.isProgramIssue
    }



    this.api.post("api/IssueProduct/UpdateCategories", newData).subscribe((res: any) => {
      console.log(res);
      this.onEditCategoriesPopupHide();
      this.getCategoriesProductDataList();
    })

    // console.log(this.editFormData);

  }

  onAddProduct() {
    console.log('Button clicked in parent!');
    // ทำงานอื่น ๆ เช่น เปิด popup, call API
  }



}

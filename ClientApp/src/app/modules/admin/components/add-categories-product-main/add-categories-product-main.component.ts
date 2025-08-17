import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api-service.service';
import { categoriesDeleteFormData, CategoriesUpdateFormData, ProductDeleteFormData, ProductUpdateFormData } from 'src/app/modules/admin/models/categories.model';
import { InsertCategoriesDataModel, InsertProductDataModel } from '../../models/insert-categories.model';
import Swal from 'sweetalert2';

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

      // console.log(res);

      this.categoryDataList = res
    })

    this.api.get("api/IssueProduct/Products/item").subscribe((res: any) => {

      // console.log(res);

      this.productDataList = res
    })

  }


  onCategoriesSubmit() {

    var data: InsertCategoriesDataModel = {
      IssueCategoriesName: this.categoryTextValue,
      isProgramIssue: this.isProgram

    }

    this.api.post('api/IssueProduct/SaveCategories', data).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
        this.getCategoriesProductDataList();

        return this.categoryPopupHide()

      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }

    })
  }

  onProductSubmit() {

    var data: InsertProductDataModel = {
      productName: this.productTextValue,

    }

    this.api.post('api/IssueProduct/SaveProduct', data).subscribe({

      next: (res: any) => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
        this.getCategoriesProductDataList();

        return this.productPopupHide()

      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }
    })
  }


  onDeleteCategory(data: categoriesDeleteFormData) {

    var newData: categoriesDeleteFormData = {
      issueCategoriesId: data.issueCategoriesId,
      issueCategoriesName: data.issueCategoriesName,
    }


    this.api.post(`api/IssueProduct/DeleteCategories`, newData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getCategoriesProductDataList();
        Swal.fire({
          title: 'สำเร็จ',
          text: 'ลบข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }
    })


  }

  onDeleteProduct(data: ProductDeleteFormData) {

    var newData: ProductDeleteFormData = {
      productId: data.productId,
      productName: data.productName,

    }


    this.api.post(`api/IssueProduct/DeleteProduct`, newData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getCategoriesProductDataList();
        Swal.fire({
          title: 'สำเร็จ',
          text: 'ลบข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }
    })


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


    this.api.post("api/IssueProduct/UpdateProduct", newData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.onEditProductPopupHide();
        this.getCategoriesProductDataList();

        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',

          confirmButtonText: 'ตกลง',
          timer: 1000
        });
      },
      error: (err) => {

        if (err.error && err.error.messages) {
          this.editProductVisible = false;

          return Swal.fire({
            title: 'error',
            text: `บันทึกข้อมูลไม่สำเร็จ: ${err.error.messages.product}`,
            icon: 'error',

            confirmButtonText: 'ตกลง',
            timer: 3000
          });



        }

        this.editProductVisible = false;

        return Swal.fire({
          title: 'error',
          text: 'บันทึกข้อมูลไม่สำเร็จ',
          icon: 'error',

          confirmButtonText: 'ตกลง',
          timer: 1000

        });
      }
    });



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



    this.api.post("api/IssueProduct/UpdateCategories", newData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.onEditCategoriesPopupHide();
        this.getCategoriesProductDataList();

        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',

          confirmButtonText: 'ตกลง',
          timer: 1000
        });
      },
      error: (err) => {

        if (err.error && err.error.messages) {
          this.editCategoriesVisible = false;

          return Swal.fire({
            title: 'บันทึกข้อมูลไม่สำเร็จ',
            text: `${err.error.messages.categories}`,
            icon: 'error',

            confirmButtonText: 'ตกลง',
            timer: 3000
          });

        }

        this.editCategoriesVisible = false;

        return Swal.fire({
          title: 'error',
          text: 'บันทึกข้อมูลไม่สำเร็จ',
          icon: 'error',

          confirmButtonText: 'ตกลง',
          timer: 1000

        });
      }
    })

    // console.log(this.editFormData);

  }

  onAddProduct() {
    console.log('Button clicked in parent!');
    // ทำงานอื่น ๆ เช่น เปิด popup, call API
  }



}

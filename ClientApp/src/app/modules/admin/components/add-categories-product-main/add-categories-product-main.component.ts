import { Component, OnInit, ViewChild } from '@angular/core';
// import { Swal } from 'sweetalert2';
// import { DataSource } from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { catchError, of } from 'rxjs';

import { DropDownService } from 'src/app/services/drop-down.service';
import { IssueProductService } from '../../services/issue-product.service';
import {
  CategoriesDeleteFormData, CategoriesParam, CategoriesUpdateFormData,
  ProductDeleteFormData, ProductParam, ProductUpdateFormData
} from '../../models/categories.model';
import { InsertCategoriesDataModel, InsertProductDataModel } from '../../models/insert-categories.model';
import { DevExtremeParam, productSearch } from '../../models/search.Model';
import DataSource from 'devextreme/data/data_source';
import Swal from 'sweetalert2';
import { Data } from '@angular/router';
import { DxCheckBoxComponent, DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-add-categories-product-main',
  templateUrl: './add-categories-product-main.component.html',
  styleUrls: ['./add-categories-product-main.component.scss']
})
export class AddCategoriesProductMainComponent implements OnInit {

  // ================= Variables =================
  categoryVisible: boolean = false;
  productVisible: boolean = false;
  editProductVisible: boolean = false;
  editCategoriesVisible: boolean = false;
  IsMap: boolean = true;
  categoriesPopupTitle: string = 'Add Categories'
  productPopupTitle: string = 'Add Product'
  categoriesError: string = "";

  categoryModel: CategoriesParam = {
    issueCategoriesId: 0,
    issueCategoriesName: '',
    issueCategoriesDescription: '',
    modifiedTime: new Date,
    isProgramIssue: false,
    action: "Add"

  };
  productModel: ProductParam = {
    productId: 0,
    productName: '',
    modifiedTime: new Date,
    action: "Add"
  }


  // categoryTextValue: string = "";

  categoryDataList: any[] = [];
  checkBoxItem: any[] = [];
  categoriesIdSearch: string = "";
  productSearch: string = "";


  categoriesDatasource!: DataSource;
  categoriesCheckBoxDatasource!: DataSource;
  productDataSource!: DataSource;

  editProductFormData: ProductUpdateFormData = {
    productId: 0,
    productName: ""
  };

  @ViewChild('productGrid', { static: false }) productGrid!: DxDataGridComponent;
  @ViewChild('categoriesGrid', { static: false }) categoriesGrid!: DxDataGridComponent;


  // ================= Constructor =================
  constructor(
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService
  ) { }

  // ================= Lifecycle =================
  ngOnInit(): void {

    this.initProductByNameCategoriesDataSource()
    this.getCategoriesItem()
    this.getCheckBoxItem()

    // this.getCategoriesProductDataList();
    // this.getCheckBoxItem();
    // this.initCheckBoxDataSource()
  }

  // ================= Popup add Show/Hide =================
  categoryPopupShow() {
    this.categoriesPopupTitle = "Add Categories"
    this.categoryVisible = true;
  }
  categoryPopupHide() {
    this.categoryVisible = false;
    this.categoryModel = {
      issueCategoriesId: 0,
      issueCategoriesName: null,
      issueCategoriesDescription: null,
      modifiedTime: new Date,
      isProgramIssue: false,
      action: "Add"

    };
  }

  onEditCategoriesPopupShow(data: CategoriesParam) {

    this.categoriesPopupTitle = "Edit Categories"
    this.categoryModel = {
      issueCategoriesId: data.issueCategoriesId,
      issueCategoriesName: data.issueCategoriesName,
      issueCategoriesDescription: data.issueCategoriesDescription,
      modifiedTime: data.modifiedTime,
      isProgramIssue: data.isProgramIssue,
      action: "Edit"


    };
    this.categoryVisible = true;
  }

  productPopupShow() {
    this.productVisible = true;
  }
  productPopupHide() {
    this.productVisible = false;
    this.productModel = {
      productId: 0,
      productName: '',
      modifiedTime: new Date,
      action: "Add"
    }
  }
  onEditProductPopupShow(data: any) {
    this.productPopupTitle = "Edit Product"
    this.productModel = {
      productId: data.productId,
      productName: data.productName,
      modifiedTime: data.modifiedTime,
      action: "Edit"
    }
    this.productPopupShow()


  }


  // ================= Text Change Handlers =================

  onIsProgramValueChanged(e: any) {
    this.categoryModel.isProgramIssue = e.value;
  }

  onChangeTest(e: string) { this.productSearch = e; }

  onCategoriesValueCheck(e: any) {
    this.categoriesIdSearch = this.getSelectedCategories();
  }

  onMaValueCheck(e: any) {
    this.IsMap = e.value
  }


  // ================= CRUD / API Calls =================
  getCategoriesItem() {

    this.issueProductService.getCategoriesItems()
      .pipe(
        catchError(err => {
          console.error('Error while loading category dropdown:', err);
          return of([]); // ถ้า error ให้ return array ว่าง
        })
      )
      .subscribe((res: any) => {
        this.categoriesDatasource = res ?? [];
      });

  }

  initProductByNameCategoriesDataSource() {


    this.productDataSource = new DataSource({
      load: (loadOptions) => {
        const newLoad: DevExtremeParam<productSearch> = {
          searchCriteria: {
            productName: this.productSearch || null,
            categoriesText: this.categoriesIdSearch || null,
            isMap: this.IsMap
          },
          loadOption: loadOptions
        };
        return this.issueProductService.QueryProductOnCategories(newLoad)
          .pipe(catchError(err => of([])))
          .toPromise();
      }
    });
  }





  onSearch() {
    this.productGrid?.instance?.refresh();
  }

  getCheckBoxItem() {
    const selectedIds = this.categoryDataList
      .filter(c => c.selected)
      .map(c => c.issueCategoriesId);

    this.categoriesCheckBoxDatasource = new DataSource({
      load: () => this.dropDownService.getCategoryDropDown().toPromise()
    });

    this.categoriesCheckBoxDatasource.load().then((res: any) => {
      this.categoryDataList = Array.isArray(res)
        ? res.map((item: any) => ({
          ...item,
          selected: selectedIds.includes(item.issueCategoriesId)
        }))
        : [];
    });
  }


  getSelectedCategories(): string {
    return this.categoryDataList.filter(c => c.selected).map(c => c.issueCategoriesId).join(',');
  }

  // categories or product
  onSave(type: string) {

    if (type === "categories") {
      this.issueProductService.categoriesManagement(this.categoryModel)
        .pipe(catchError(err => {


          this.categoryPopupHide()
          Swal.fire({
            title: 'ไม่มีอะไรเปลี่ยนแปลง',
            text: err.error.messages.categories ||
              err.error.messages.time || 'มีบางอย่างผิดพลาด', // ตรวจสอบ property
            icon: 'question',
            showConfirmButton: false,
            timer: 2000
          });



          return err
        })).subscribe((res => {
          this.categoryPopupHide()
          this.getCategoriesItem()
          this.getCheckBoxItem()
          this.showSuccessPopup()
        }))
      return
    } else {

      this.issueProductService.productManagement(this.productModel)
        .pipe(catchError(err => {

          this.productPopupHide()

          Swal.fire({

            title: 'ไม่มีอะไรเปลี่ยนแปลง',
            text: err.error.messages.product ||
              err.error.messages.time ||
              'มีบางอย่างผิดพลาด', // ตรวจสอบ property
            icon: 'question',
            showConfirmButton: false,
            timer: 2000


          });
          return err
        })).subscribe((res: any) => {

          // this.initProductByNameCategoriesDataSource()
          this.productGrid.instance.refresh()
          this.productPopupHide()
          this.showSuccessPopup()

        })
    }
  }

  showDeleteAlert(data: any, type: string) {

    if (type === "product") {
      Swal.fire({
        title: "ต้องการดำเนินการลบ ?",
        text: `ยืนยันที่จะลบ ${data.productName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน"
      }).then((result) => {
        if (result.isConfirmed) {

          this.productModel = { ...data }
          this.productModel.action = "Delete";
          this.onSave("product")
        }
      });
    } else {

      Swal.fire({
        title: "ต้องการดำเนินการลบ ?",
        text: `ยืนยันที่จะลบ ${data.issueCategoriesDescription}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน"
      }).then((result) => {
        if (result.isConfirmed) {

          this.categoryModel = { ...data }
          this.categoryModel.action = "Delete"
          this.onSave("categories")
        }
      });
    }


  }


  showSuccessPopup() {

    return Swal.fire({
      title: 'สำเร็จ',
      text: 'อัพเดทข้อมูลเรีบร้อยแล้ว', // ตรวจสอบ property
      icon: 'success',
      showConfirmButton: false,
      timer: 2000
    });


  }
}

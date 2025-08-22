import { Component, OnInit } from '@angular/core';
// import { Swal } from 'sweetalert2';
// import { DataSource } from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { catchError, of } from 'rxjs';

import { DropDownService } from 'src/app/services/drop-down.service';
import { IssueProductService } from '../../services/issue-product.service';
import { 
  CategoriesDeleteFormData, CategoriesUpdateFormData, 
  ProductDeleteFormData, ProductUpdateFormData 
} from '../../models/categories.model';
import { InsertCategoriesDataModel, InsertProductDataModel } from '../../models/insert-categories.model';
import { DevExtremeParam, productSearch } from '../../models/search.Model';
import DataSource from 'devextreme/data/data_source';
import Swal from 'sweetalert2';

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

  categoryTextValue: string = "";
  productTextValue: string = "";
  isProgram: boolean = false;

  editProductText: string = "";
  editCategoriesText: string = "";

  categoryDataList: any[] = [];
  productDataList: any[] = [];
  checkBoxItem: any[] = [];

  categoriesIdSearch: string = "";
  productSearch: string = "";

  ProductByCategoriesDataSource!: DataSource;

  editCategoriesFormData: CategoriesUpdateFormData = {
    issueCategoriesId: 0,
    issueCategoriesName: "",
    isProgramIssue: false
  };

  editProductFormData: ProductUpdateFormData = {
    productId: 0,
    productName: ""
  };

  // ================= Constructor =================
  constructor(
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService
  ) {}

  // ================= Lifecycle =================
  ngOnInit(): void {
    this.getCategoriesProductDataList();
    this.getCheckBoxItem();
    this.initProductByNameCategoriesDataSource();
  }

  // ================= Popup Show/Hide =================
  categoryPopupShow() { this.categoryVisible = true; }
  categoryPopupHide() {
    this.categoryVisible = false;
    this.categoryTextValue = '';
    this.isProgram = false;
  }

  productPopupShow() { this.productVisible = true; }
  productPopupHide() {
    this.productVisible = false;
    this.productTextValue = '';
  }

  onEditProductPopupShow(data: ProductUpdateFormData) {
    this.editProductVisible = true;
    this.editProductText = data.productName;
    this.editProductFormData = { ...data };
  }

  onEditProductPopupHide() {
    this.editProductVisible = false;
    this.editProductFormData = { productId: 0, productName: "", modifiedTime: undefined };
  }

  onEditCategoriesPopupShow(data: CategoriesUpdateFormData) {
    this.editCategoriesVisible = true;
    this.editCategoriesText = data.issueCategoriesName;
    this.editCategoriesFormData = { ...data };
  }

  onEditCategoriesPopupHide() {
    this.editCategoriesVisible = false;
    this.editCategoriesFormData = { issueCategoriesId: 0, issueCategoriesName: "", isProgramIssue: false, modifiedTime: undefined };
  }

  // ================= Text Change Handlers =================
  onTextValueChanged(e: any) { this.categoryTextValue = e.value; }
  onProductTextValueChanged(e: any) { this.productTextValue = e.value; }
  onChangeTest(e: string) { this.productSearch = e; }
  onCategoriesValueCheck(e: any) { this.categoriesIdSearch = this.getSelectedCategories(); }

  // ================= CRUD / API Calls =================
  getCategoriesProductDataList() {
    this.dropDownService.getCategoryDropDown().pipe(catchError(err => of([])))
      .subscribe(res => this.categoryDataList = Array.isArray(res) ? res : []);

    this.dropDownService.getProductDropDown().pipe(catchError(err => of([])))
      .subscribe(res => this.productDataList = Array.isArray(res) ? res : []);
  }

  onCategoriesSubmit() {
    const data: InsertCategoriesDataModel = { IssueCategoriesName: this.categoryTextValue, isProgramIssue: this.isProgram };
    this.issueProductService.onSaveCategories(data)
      .pipe(catchError(err => of(err)))
      .subscribe(() => {
        Swal.fire('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
        this.getCategoriesProductDataList();
        this.categoryPopupHide();
      });
  }

  onProductSubmit() {
    const data: InsertProductDataModel = { productName: this.productTextValue };
    this.issueProductService.onSaveProduct(data)
      .pipe(catchError(err => of(err)))
      .subscribe(() => {
        Swal.fire('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
        this.getCategoriesProductDataList();
        this.productPopupHide();
      });
  }

  onDeleteCategory(data: CategoriesDeleteFormData) {
    this.issueProductService.onDeleteCategories(data)
      .pipe(catchError(err => of(err)))
      .subscribe(() => {
        this.getCategoriesProductDataList();
        Swal.fire('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success');
      });
  }

  onDeleteProduct(data: ProductDeleteFormData) {
    this.issueProductService.onDeleteProduct(data)
      .pipe(catchError(err => of(err)))
      .subscribe(() => {
        this.getCategoriesProductDataList();
        Swal.fire('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success');
      });
  }

  onEditPopupSubmit() {
    const newData = { ...this.editProductFormData, productName: this.editProductText };
    this.issueProductService.onUpdateProduct(newData)
      .pipe(catchError(err => of(err)))
      .subscribe(() => {
        this.onEditProductPopupHide();
        this.getCategoriesProductDataList();
        Swal.fire('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
      });
  }

  onEditCategoriesPopupSubmit() {
    const newData = { ...this.editCategoriesFormData, issueCategoriesName: this.editCategoriesText };
    this.issueProductService.onUpdateCategories(newData)
      .pipe(catchError(err => of(err)))
      .subscribe(() => {
        this.onEditCategoriesPopupHide();
        this.getCategoriesProductDataList();
        Swal.fire('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
      });
  }

  // ================= Search / Filter =================
  onSearch() { this.initProductByNameCategoriesDataSource(this.productSearch, this.categoriesIdSearch); }

  initProductByNameCategoriesDataSource(productName: string | null = null, categoriesId: string | null = null) {
    this.ProductByCategoriesDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<productSearch> = { searchCriteria: { productName, categoriesText: categoriesId }, loadOption: loadOptions };
        return this.issueProductService.QueryProductOnCategories(newLoad)
          .pipe(catchError(err => of(err)))
          .toPromise();
      }
    });
  }

  getCheckBoxItem() {
    this.dropDownService.getCategoryDropDown()
      .pipe(catchError(err => of([])))
      .subscribe((res: any) => {
        this.categoryDataList = Array.isArray(res) ? res.map((item: any) => ({ ...item, selected: false })) : [];
      });
  }

  getSelectedCategories(): string {
    return this.categoryDataList.filter(c => c.selected).map(c => c.issueCategoriesId).join(',');
  }

}

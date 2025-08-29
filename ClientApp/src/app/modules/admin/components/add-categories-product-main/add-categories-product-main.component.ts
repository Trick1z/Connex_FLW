import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';
import { IssueProductService } from '../../services/issue-product.service';
import { CategoriesParam, ProductParam, ProductUpdateFormData } from '../../models/categories.model';
import { DevExtremeParam, productSearch } from '../../models/search.Model';
import DataSource from 'devextreme/data/data_source';
import Swal from 'sweetalert2';
import { DxDataGridComponent } from 'devextreme-angular';
import { CheckboxList } from 'src/app/models/checkBox.model';
import { Alert } from 'src/app/constants/alert.const';
import { SwalService } from '../../services/swal.service';
import { Button, HeaderUnderline } from 'src/app/constants/color.const';

@Component({
  selector: 'app-add-categories-product-main',
  templateUrl: './add-categories-product-main.component.html',
  styleUrls: ['./add-categories-product-main.component.scss']
})
export class AddCategoriesProductMainComponent implements OnInit {

  buttonColor = Button;
  underlineColor = HeaderUnderline;

  categoryVisible: boolean = false;
  productVisible: boolean = false;
  editProductVisible: boolean = false;
  editCategoriesVisible: boolean = false;
  isMap: boolean = true;
  categoriesPopupTitle: string = 'Add Categories'
  productPopupTitle: string = 'Add Product'
  popupButtonText: string = "Create"
  categoriesError: string = "";
  categoryDataList: CheckboxList<number>[] = [];
  checkBoxItem: any[] = [];
  categoriesIdSearch: string = "";
  productSearch: string = "";
  categoriesDatasource!: DataSource;
  categoriesCheckBoxDatasource!: DataSource;
  productDataSource!: DataSource;

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
  editProductFormData: ProductUpdateFormData = {
    productId: 0,
    productName: ""
  };

  @ViewChild('productGrid', { static: false }) productGrid!: DxDataGridComponent;
  @ViewChild('categoriesGrid', { static: false }) categoriesGrid!: DxDataGridComponent;


  constructor(
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService,
    private swalService: SwalService
  ) { }

  ngOnInit(): void {

    this.initProductDataSource()
    this.initCategoriesDataSource()
    this.initCategoriesCheckBoxDataSource()
  }

  onIsProgramValueChanged(e: any) { this.categoryModel.isProgramIssue = e.value; }
  onChangeTest(e: string) { this.productSearch = e; }
  onCategoriesValueCheck(e: any) { this.categoriesIdSearch = this.getSelectedCategories(); }
  onMaValueCheck(e: any) { this.isMap = e.value }

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
    this.productPopupTitle = "Add Product"
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

  initCategoriesDataSource() {
    this.categoriesDatasource = new DataSource({
      load: (loadOptions) => {

        return this.issueProductService.getCategoriesItems()
          .pipe(catchError(err => of([])))
          .toPromise();
      }
    });


  }

  initProductDataSource() {
    this.productDataSource = new DataSource({
      load: (loadOptions) => {
        const newLoad: DevExtremeParam<productSearch> = {
          searchCriteria: {
            productName: this.productSearch || null,
            categoriesText: this.categoriesIdSearch || null,
            isMap: this.isMap
          },
          loadOption: loadOptions
        };
        return this.issueProductService.queryProductOnCategories(newLoad)
          .pipe(catchError(err => of([])))
          .toPromise();
      }
    });
  }

  onSearch() { this.productGrid?.instance?.refresh(); }

  initCategoriesCheckBoxDataSource() {
    const selectedIds = this.categoryDataList
      .filter(c => c.selected)
      .map(c => c.value);
    this.categoriesCheckBoxDatasource = new DataSource({
      load: () => this.dropDownService.getCategoryDropDown().toPromise()
    });
    this.categoriesCheckBoxDatasource.load().then((res: any) => {
      this.categoryDataList = Array.isArray(res)
        ? res.map((item: any) => ({
          value: item.value,
          text: item.showText,
          selected: selectedIds.includes(item.value)
        }))
        : [];
    });
  }

  getSelectedCategories(): string { return this.categoryDataList.filter(c => c.selected).map(c => c.value).join(','); }

  onSave(type: string) {
    if (type === "categories") {
      this.issueProductService.categoriesManagement(this.categoryModel)
        .pipe(catchError(err => {
          this.categoryPopupHide()
          this.swalService.showErrorLog(err)

          return err
        })).subscribe((res => {
          this.categoryPopupHide()
          this.categoriesGrid.instance.refresh()
          this.initCategoriesCheckBoxDataSource()
          this.swalService.showSuccessPopup(Alert.saveSuccessfully)
        }))
      return
    } else {
      this.issueProductService.productManagement(this.productModel)
        .pipe(catchError(err => {
          this.productPopupHide()
          this.swalService.showErrorLog(err)
          return err
        })).subscribe((res: any) => {
          this.productGrid.instance.refresh()
          this.productPopupHide()
          this.swalService.showSuccessPopup(Alert.saveSuccessfully)
        })
    }
  }

  onProductDeleteClicked(data: any) {
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
        this.issueProductService.deleteProductItems(this.productModel)
          .pipe(catchError(err => {
            this.swalService.showErrorLog(err)
            return of(null)
          })).subscribe((res: any) => {

            this.swalService.showSuccessPopup(Alert.deleteSuccessfully)
          })
      }
    });

  }

  onCategoriesDeleteClicked(data: any) {
    Swal.fire({
      title: "ต้องการดำเนินการลบ ?",
      text: `ยืนยันที่จะลบ ${data.issueCategoriesName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน"
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryModel = { ...data }

      } this.issueProductService.deleteCategoriesItems(this.categoryModel)
        .pipe(catchError(err => {
          this.swalService.showErrorLog(err)
          return of(null)
        })).subscribe((res: any) => {

          this.swalService.showSuccessPopup(Alert.deleteSuccessfully)
          this.categoriesGrid.instance.refresh()
        })
    });

  }


}

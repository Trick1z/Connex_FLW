import { Component, OnInit, ViewChild } from '@angular/core';
import { ValueChangedEvent as TagValueChangedEvent } from 'devextreme/ui/tag_box';
import { categoriesMapProductViewModel, ProductsDataModel } from '../../models/tag-option.model';
import Swal from 'sweetalert2';
import { IssueProductService } from '../../services/issue-product.service';
import { DropDownService } from 'src/app/services/drop-down.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { catchError, of } from 'rxjs';
import { DevExtremeParam, Search } from '../../models/search.Model';
import { DropDownList } from 'src/app/models/dropDown.model';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  // =================== Variables ===================
  categoryVisible = false;
  productVisible = false;
  CategoriesName: string = '';

  categoriesDataList: DropDownList[] = [];
  ProductTagOptions: ProductsDataModel[] = [];
  searchCategoriesValue: string = "";

  viewPopupDetail: boolean = false;
  viewUserCategoriesName: string = '';
  viewCategoriesDetail: Array<string> = []
  ;
  categoriesDataSource!: DataSource; // <-- ใช้ DataSource แทน array
  categoriesMapProduct!: categoriesMapProductViewModel;

  // @ViewChild('categoriesGrid', { static: false }) public categoriesGrid!: DxDataGridComponent;

  constructor(
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService
  ) { }

  ngOnInit(): void {
    this.getCategoryProductItemDetail();
    this.initCategoriesDataSource();
  }

  // =================== Load Categories ===================
  getCategoryProductItemDetail() {
    this.dropDownService.getCategoryDropDown()
      .pipe(catchError(err => {
        console.error(err);
        return of([]);
      }))
      .subscribe((res: any) => {
        this.categoriesDataList = res as DropDownList[];
      });
  }

  // =================== Product Popup ===================
  productPopupShow(data: any) {
    this.CategoriesName = data.issueCategoriesName;
    this.loadCategoryProducts(data.issueCategoriesId);
    this.loadCategoriesMapProductDropdown();

    this.categoriesDataSource.reload()
    this.productVisible = true;
  }

  productPopupHide() {
    this.productVisible = false;
  }

  // =================== Load Products ===================
  private loadCategoryProducts(categoryId: number) {
    this.issueProductService.getProductsForCategory(categoryId)
      .pipe(catchError(err => {
        console.error(err);
        this.categoriesMapProduct = {
          categoriesId: categoryId,
          product: [],
          productText: '',
          modifiedTime: null
        };
        return of(this.categoriesMapProduct);
      }))
      .subscribe((res: any) => {
        this.categoriesMapProduct = res;
      });
  }

  private loadCategoriesMapProductDropdown() {
    this.categoriesDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        return this.dropDownService.getCategoriesMapProductDropDown()
          .pipe(catchError(err => {
            console.error(err);
            return of([]);
          }))
          .toPromise();
      }
    });
  }

  // =================== Change Handler ===================
  onChange(e: any) {
    this.categoriesMapProduct.product = e.value;
  }

  // =================== Save Product Mapping ===================
  onProductSaveData() {
    this.issueProductService.onProductSaveData(this.categoriesMapProduct)
      .pipe(catchError(err => {
        Swal.fire({
          title: 'Error',
          text: 'มีข้อผิดพลาดในการบันทึกข้อมูล',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
        return of(null);
      }))
      .subscribe((res: any) => {
        if (res) {
          this.productVisible = false;
          Swal.fire({
            title: 'สำเร็จ',
            text: 'บันทึกข้อมูลสำเร็จ',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            timer: 1000
          });
        }
      });
  }

  // =================== View Product Detail ===================
  getViewProductDetail(data: any) {
    this.viewUserCategoriesName = data.issueCategoriesName;
    this.loadViewProducts(data.issueCategoriesId);

    this.viewPopupDetail = true;

  }

  private loadViewProducts(categoryId: number) {
    this.issueProductService.getViewProductDetail(categoryId)
      .pipe(catchError(err => {
        console.error(err);
        this.viewCategoriesDetail = [];
        return of({ productText: '' });
      }))
      .subscribe((res: any) => {
        this.viewCategoriesDetail = res.productText?.split(',') || [];
      });
  }

  onViewPopupHide() {
    this.viewPopupDetail = false;
  }

  // =================== Search & DataSource ===================
  onSearchValueChange(e: any) {
    this.searchCategoriesValue = e;
    // this.initCategoriesDataSource(this.searchCategoriesValue);
  }




  initCategoriesDataSource(textParam: string | null = null) {
    this.categoriesDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<Search> = {
          searchCriteria: { text: textParam },
          loadOption: loadOptions
        };
        return this.issueProductService.queryCategoriesByText(newLoad)
          .pipe(catchError(err => {
            console.error(err);
            return of([]);
          }))
          .toPromise();
      }
    });
  }
}

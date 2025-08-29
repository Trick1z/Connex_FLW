import { Component, OnInit, ViewChild } from '@angular/core';
import { categoriesMapProductViewModel, ProductsDataModel } from '../../models/tag-option.model';
import { IssueProductService } from '../../services/issue-product.service';
import { DropDownService } from 'src/app/services/drop-down.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { catchError, lastValueFrom, of } from 'rxjs';
import { DevExtremeParam, Search } from '../../models/search.Model';
import { DxDataGridComponent } from 'devextreme-angular';
import { Button, HeaderUnderline } from 'src/app/constants/color.const';
import { SwalService } from '../../services/swal.service';
import { Alert } from 'src/app/constants/alert.const';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  buttonColor = Button;
  underlineColor = HeaderUnderline;

  productVisible: boolean = false;
  viewPopupDetail: boolean = false;
  categoriesName: string = '';
  productTagDataSource: ProductsDataModel[] = [];
  searchCategoriesValue: string = "";
  viewUserCategoriesName: string = '';
  viewCategoriesDetail: Array<string> = [];
  categoriesDataSource!: DataSource;
  categoriesMapProduct!: categoriesMapProductViewModel;

  @ViewChild('categoriesGrid', { static: false }) public categoriesGrid!: DxDataGridComponent;
  @ViewChild('checkBoxMap', { static: false }) public checkBoxMap!: DxDataGridComponent;

  constructor(
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService,
    private swalService : SwalService
  ) { }

  ngOnInit(): void {
    this.initCategoriesDataSource();
    this.initProductDropdown()
  }

  onChange(e: any) { this.categoriesMapProduct.product = e.value; }
  onSearchValueChange(e: any) { this.searchCategoriesValue = e; }

  productPopupShow(data: any) {
    this.categoriesName = data.issueCategoriesName;
    this.loadCategoryProducts(data.issueCategoriesId);
    this.categoriesGrid.instance.refresh()
    this.productVisible = true;
  }

  productPopupHide() { this.productVisible = false; }

  loadCategoriesMapProductDropdown() {
    this.categoriesDataSource = new DataSource({
      load: async (loadOptions: LoadOptions) => {
        try {
          const res = await lastValueFrom(this.dropDownService.getCategoriesMapProductDropDown()
            .pipe(catchError(err => {
              return of([]); // return empty array แทน
            })));
          return res;
        } catch (error) {
          return [];
        }
      }
    });
  }

  onProductSave() {
    this.issueProductService.onProductSaveData(this.categoriesMapProduct)
      .pipe(catchError(err => {
        this.productVisible = false;
        this.swalService.showErrorLog(err);
  
        return of(null);
      })).subscribe((res: any) => {
        if (res) {
          this.productVisible = false;
          this.swalService.showSuccessPopup(Alert.saveSuccessfully)   
        }
      });
  }

  getViewProductDetail(data: any) {
    this.viewUserCategoriesName = data.issueCategoriesName;
    this.loadViewProducts(data.issueCategoriesId);
    this.viewPopupDetail = true;
  }

  private loadViewProducts(categoryId: number) {
    this.issueProductService.getViewProductDetail(categoryId)
      .pipe(catchError(err => {
        this.viewCategoriesDetail = [];
        return of([]);
      })).subscribe((res: any) => {
        this.viewCategoriesDetail = res.productText?.split(',') || [];
      });
  }

  onViewPopupHide() { this.viewPopupDetail = false; }
  onSearchClicked() { this.categoriesGrid.instance.refresh(); }

  initCategoriesDataSource() {
    this.categoriesDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<Search> = {
          searchCriteria: { text: this.searchCategoriesValue },
          loadOption: loadOptions
        };
        return this.issueProductService.queryCategoriesByText(newLoad)
          .pipe(catchError(err => {
            return of([]);
          }))
          .toPromise();
      }
    });
  }

  initProductDropdown() {
    this.dropDownService.getCategoriesMapProductDropDown()
      .pipe(catchError(err => {
        return of([]);
      })).subscribe((res: any[]) => {
        this.productTagDataSource = res;
      });
  }

  loadCategoryProducts(categoryId: number) {
    this.issueProductService.getProductsForCategory(categoryId)
      .pipe(catchError(err => {
        this.categoriesMapProduct = {
          categoriesId: categoryId,
          product: [],
          productText: '',
          modifiedTime: null
        };
        return of(this.categoriesMapProduct);
      })).subscribe((res: any) => {
        this.categoriesMapProduct = res;
      });
  }
}

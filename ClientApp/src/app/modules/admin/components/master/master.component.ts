import { Component, OnInit } from '@angular/core';
import { ValueChangedEvent as TagValueChangedEvent } from 'devextreme/ui/tag_box';
import {  categoriesMapProductViewModel, ProductsDataModel } from '../../models/tag-option.model';
import Swal from 'sweetalert2';
import { IssueProductService } from '../../services/issue-product.service';
import { catchError } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import {  DevExthemeParam, Search } from '../../models/search.Model';
import { DropDownList } from 'src/app/models/dropDown.model';
// import { ApiService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

   ngOnInit(): void {
    this.getCategoryProductItemDetail();
    this.initCategoriesDataSource();
  }

  constructor(
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService
  ) { }


  categoryVisible = false;
  productVisible = false;
  dataList: any;
  columns = [
    { dataField: 'word', caption: 'คำ', width: 200 },
    { dataField: 'score', caption: 'คะแนน', width: 80 },
    { dataField: 'date', caption: 'วันที่', width: 150 }
  ];
  categoryTextValue: string = '';
  categorySelectedTags: number[] = [];
  productTextValue: string = '';
  productSelectedTags: number[] = [];
  CategoriesName: string = '';
  globalId: number = 0;
  categoriesDataList: DropDownList[] = [];
  ProductTagOptions: ProductsDataModel[] = [];
  searchCategoriesValue: string = "";
  CategoriesDataSource!: DataSource; 
   viewPopupDetail: boolean = false;
  viewUserCategoriesName: string = '';
  viewCategoriesDetail: Array<string> = [];
  categoriesDataSource: DropDownList[] = [];
  categoriesMapProduct!: categoriesMapProductViewModel;

  onSelectedTagsChanged(e: any) {
    const event = e as TagValueChangedEvent;

    this.categorySelectedTags = e.value;
  }
  onProductSelectedTagsChanged(e: any) {
    const event = e as TagValueChangedEvent;

    this.productSelectedTags = e.value;
  }


  productPopupShow(data: any) {
    this.globalId = data.issueCategoriesId;
    this.CategoriesName = data.issueCategoriesName;
    this.getProductsForCategory(data.issueCategoriesId)
    this.productVisible = true;
  }

  productPopupHide() {
    this.productVisible = false;
  }

  getCategoryProductItemDetail() {

    this.dropDownService.getCategoryDropDown()
      .pipe(catchError(err => { return err }))
      .subscribe((res: any) => {
        this.categoriesDataList = res

      })
  }



  onChange(e: any) {
    this.categoriesMapProduct.product = e.value
  }

  getProductsForCategory(id: number) {
    this.issueProductService.getProductsForCategory(id)
      .pipe(catchError(err => {

        this.categoriesMapProduct = {
          categoriesId: id,
          product: [],
          productText: '',
          modifiedTime: null
        };


        return err
      })).subscribe((res: any) => {
        this.categoriesMapProduct = res;
      })



    this.dropDownService.getCategoriesMapProductDropDown().pipe(catchError(err => {
      return err


    }))
      .subscribe((res: any) => {
        this.categoriesDataSource = res

      });
  }

  onProductSaveData() {

    this.issueProductService.onProductSaveData(this.categoriesMapProduct)
      .pipe(catchError(err => {
        Swal.fire({
          title: 'error',
          text: 'มีข้อมผิดพลาดในการบันทึกข้อมูล',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
        return err

      }))
      .subscribe((res: any) => {
        this.productVisible = false;
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });

      })
  }
  onViewPopupHide() {
    this.viewPopupDetail = false;
  }

  getViewProductDetail(data: any) {
    this.viewPopupDetail = true;
    this.viewUserCategoriesName = data.issueCategoriesName;
    var id = data.issueCategoriesId;
    this.issueProductService.getViewProductDetail(id).pipe(catchError(err => {
      this.viewCategoriesDetail = []
      return err
    }))
      .subscribe((res: any) => {
        this.viewCategoriesDetail = res.productText.split(',');
      },);
  }

  onSearchValueChange(e: any) {
    console.log(e);

    this.searchCategoriesValue = e;

   this.initCategoriesDataSource(this.searchCategoriesValue);

  }
  initCategoriesDataSource(textParam:string | null = null) {

    this.CategoriesDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {

        var newLoad: DevExthemeParam<Search> = {

          searchCriteria: { text: textParam },

          loadOption: loadOptions
        }
        return this.issueProductService.queryCategoriesByText(newLoad)
          .pipe(catchError(err => {

            return err
          })).toPromise()
      }
    });
  }
}

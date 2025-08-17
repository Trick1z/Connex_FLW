import { Component, OnInit } from '@angular/core';
import { ValueChangedEvent } from 'devextreme/ui/filter_builder';
import { ValueChangedEvent as TagValueChangedEvent } from 'devextreme/ui/tag_box';
import { CategoriesDataModel, categoriesMapProductViewModel, DropDownList, ProductsDataModel } from '../../models/tag-option.model';
import { ApiService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';
// import { ApiService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
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

  ngOnInit(): void {
    // this.getCategoriesProductData();
    this.getCategoryProductItemDetail();
  }

  constructor(
    private api: ApiService
  ) { }




  onSelectedTagsChanged(e: any) {
    const event = e as TagValueChangedEvent;

    this.categorySelectedTags = e.value;
  }


  onProductSelectedTagsChanged(e: any) {
    const event = e as TagValueChangedEvent;

    this.productSelectedTags = e.value;
  }


  // products
  productPopupShow(data: any) {
    this.globalId = data.issueCategoriesId;
    this.CategoriesName = data.issueCategoriesName;
    this.getProductsForCategory(data.issueCategoriesId)

    this.productVisible = true;

    // this.loadProductsForCategory(data.issueCategoriesId);
  }

  productPopupHide() {
    this.productVisible = false;
  }

  // get [products , category ] data
  getCategoryProductItemDetail() {

    this.api.get("api/IssueProduct/Categories/item").subscribe((res: any) => {
      this.categoriesDataList = res
      // console.log(res);

    })


  }

  categoriesDataSource: DropDownList[] = [];

  categoriesMapProduct!: categoriesMapProductViewModel;

  onChange(e: any) {
    this.categoriesMapProduct.product = e.value
    // console.log(e);

  }

  getProductsForCategory(id: number) {
    this.api.get(`api/IssueProduct/LoadCategories/${id}`)
      .subscribe({
        next: (res: categoriesMapProductViewModel) => {
          this.categoriesMapProduct = res;
        },
        error: (err) => {
          // console.error('❌ API Error:', err);
          // 
          this.categoriesMapProduct = {
            categoriesId: id,
            product: [],
            productText: '',
            modifiedTime: null
          };
        }
      });



    this.api.get(`api/DropDown/CategoriesMapProductDropDown`).subscribe((res: DropDownList[]) => {


      this.categoriesDataSource = res


    });
  }




  onProductSaveData() {

    this.api.post(`api/IssueProduct/SaveIssueMapProduct`, this.categoriesMapProduct).subscribe({
      next: (res: categoriesMapProductViewModel) => {
        // console.log('✅ Data Saved:', res);
        this.productVisible = false;

        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });

      },
      error: (err) => {
        Swal.fire({
          title: 'error',
          text: 'มีข้อมผิดพลาดในการบันทึกข้อมูล',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });

      }
    });
  }


  viewPopupDetail: boolean = false;
  viewUserCategoriesName: string = '';
  viewCategoriesDetail: Array<string> = [];


  onViewPopupHide() {
    this.viewPopupDetail = false;
  }


  getViewProductDetail(data: any) {
    this.viewPopupDetail = true;

    this.viewUserCategoriesName = data.issueCategoriesName;

    var id = data.issueCategoriesId;
    this.api.get(`api/IssueProduct/LoadCategories/${id}`)
      .subscribe({
        next: (res: categoriesMapProductViewModel) => {
          this.viewCategoriesDetail = res.productText.split(',');
        },
        error: (err) => {

          this.viewCategoriesDetail = []
        }
      });
  }


}

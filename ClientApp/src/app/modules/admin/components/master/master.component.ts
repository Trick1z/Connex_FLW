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
      console.log(res);

    })


  }


  // loadProductsForCategory(id: number) {
  //   // ดึงข้อมูลทั้งหมดจาก backend (รวม mapped/unmapped)
  //   this.api.get(`api/DropDown/GetProductsWithSelection/${id}`).subscribe((res: any) => {
  //     // products สำหรับ TagBox
  //     this.ProductTagOptions = res.allProducts.map((p: any) => ({
  //       productId: p.productId,
  //       productName: p.productName,
  //       isActive: p.isActive
  //     }));

  //     // ค่าเริ่มต้น selected สำหรับ TagBox
  //     // this.productSelectedTags = res.selectedProduct;
  //     this.productSelectedTags = res.selectedProduct.map((p: any) => p.productId);

  //     console.log('All Products:', this.ProductTagOptions);
  //     console.log('Selected Products:', this.productSelectedTags);
  //   });
  // }

  // loadProductsForCategory(id: number) {
  //   this.api.get(`api/DropDown/CategoriesMapProductDropDown`).subscribe((res: any) => {
  //     // กำหนด options ให้ TagBox
  //     this.ProductTagOptions = res.allProducts.map((p: any) => ({
  //       productId: p.productId,
  //       productName: p.productName,
  //       isActive: p.isActive
  //     }));

  //     // กำหนดค่าที่เลือกไว้ให้ TagBox (ต้องเป็น array ของ productId)
  //     this.productSelectedTags = res.selectedProduct.map((p: any) => p.productId);

  //     console.log('All Products:', this.ProductTagOptions);
  //     console.log('Selected Product IDs:', this.productSelectedTags);
  //   });
  // }

  // categoriesMapProduct: DropDownList[] = [];
  categoriesDataSource: DropDownList[] = [];

  categoriesMapProduct!: categoriesMapProductViewModel;

  onChange(e: any) {
    this.categoriesMapProduct.product = e.value
    console.log(e);

  }

  getProductsForCategory(id: number) {
    this.api.get(`api/IssueProduct/LoadCategories/${id}`)
      .subscribe({
        next: (res: categoriesMapProductViewModel) => {
          this.categoriesMapProduct = res;
          console.log('✅ Data loaded:', res);
        },
        error: (err) => {
          console.error('❌ API Error:', err);

          this.categoriesMapProduct = {
            categoriesId: id,
            product: [],
            productText: '',
            modifiedTime: null
          };
        },
        complete: () => {
          console.log('ℹ️ API call completed');
        }
      });



    this.api.get(`api/DropDown/CategoriesMapProductDropDown`).subscribe((res: DropDownList[]) => {


      this.categoriesDataSource = res


    });
  }




  onProductSaveData() {


    // this.api.post(`api/IssueProduct/SaveIssueMapProduct`, this.categoriesMapProduct).subscribe((res: any) => {

    //   this.productVisible = false;

    // })

    this.api.post(`api/IssueProduct/SaveIssueMapProduct`, this.categoriesMapProduct).subscribe({
      next: (res: categoriesMapProductViewModel) => {
        console.log('✅ Data Saved:', res);
        this.productVisible = false;

        Swal  .fire({
          title: 'สำเร็จ',      
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',  
          confirmButtonText: 'ตกลง',
          timer: 1000
        }); 

      },
      error: (err) => {
        Swal  .fire({
          title: 'error',      
          text: 'มีข้อมผิดพลาดในการบันทึกข้อมูล',
          icon: 'error',  
          confirmButtonText: 'ตกลง',
          timer: 1000
        }); 

      }
    });
  }
}

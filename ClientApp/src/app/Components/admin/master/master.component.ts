import { Component, OnInit } from '@angular/core';
import { ValueChangedEvent } from 'devextreme/ui/filter_builder';
import { ValueChangedEvent as TagValueChangedEvent } from 'devextreme/ui/tag_box';
import { CategoriesDataModel, ProductsDataModel } from './model/tag-option.model';
import { ApiService } from 'src/app/Services/api-service.service';
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

  // categoriesTagOptions = [
  //   { id: 1, name: 'Angular' },
  //   { id: 2, name: 'DevExtreme' },
  //   { id: 3, name: 'TypeScript' },
  //   { id: 4, name: 'C#' }
  // ];

  categoriesDataList: CategoriesDataModel[] = [];
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
    this.productVisible = true;
    this.CategoriesName = data.issueCategoriesName;
    this.globalId = data.issueCategoriesId;
    this.loadProductsForCategory(data.issueCategoriesId);
  }

  productPopupHide() {
    this.productVisible = false;
    this.productSelectedTags = []
  }

  // get [products , category ] data
  getCategoryProductItemDetail() {

    this.api.get("api/IssueProduct/Categories/item").subscribe((res: any) => {
      this.categoriesDataList = res
      // console.log(res);

    })


  }


loadProductsForCategory(id: number) {
  // ดึงข้อมูลทั้งหมดจาก backend (รวม mapped/unmapped)
  this.api.get(`api/DropDown/GetProductsWithSelection/${id}`).subscribe((res: any) => {
    // products สำหรับ TagBox
    this.ProductTagOptions = res.allProducts.map((p: any) => ({
      productId: p.productId,
      productName: p.productName,
      isActive: p.isActive
    }));

    // ค่าเริ่มต้น selected สำหรับ TagBox
    this.productSelectedTags = res.selectedProductIds;

    console.log('All Products:', this.ProductTagOptions);
    console.log('Selected Products:', this.productSelectedTags);
  });
}

    onProductSaveData() {


    var newData = {
      categoriesId : this.globalId,
      productsId : this.productSelectedTags

    }

    this.api.post(`api/IssueProduct/SaveIssueMapProduct`,newData).subscribe((res : any)=> {

      this.productVisible = false;

    })
  }
}

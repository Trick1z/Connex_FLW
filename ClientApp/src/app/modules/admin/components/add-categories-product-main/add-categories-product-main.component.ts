import { Component, OnInit } from '@angular/core';
import { categoriesDeleteFormData, CategoriesUpdateFormData, ProductDeleteFormData, ProductUpdateFormData } from 'src/app/modules/admin/models/categories.model';
import { InsertCategoriesDataModel, InsertProductDataModel } from '../../models/insert-categories.model';
import Swal from 'sweetalert2';
import { DropDownService } from 'src/app/services/drop-down.service';
import { catchError, of } from 'rxjs';
import { IssueProductService } from '../../services/issue-product.service';
import { LoadOptions } from 'devextreme/data';
import DataSource from 'devextreme/data/data_source';
import { categoriesSearch, DevExthemeParam, productSearch } from '../../models/search.Model';

@Component({
  selector: 'app-add-categories-product-main',
  templateUrl: './add-categories-product-main.component.html',
  styleUrls: ['./add-categories-product-main.component.scss']
})
export class AddCategoriesProductMainComponent implements OnInit {
  ngOnInit(): void {
    this.getCategoriesProductDataList();
    this.getCheckBoxItem()
    this.initProductByNameCategoriesDataSource(null, null)
  }

  constructor(
    // private api: ApiService,
    private dropDownService: DropDownService,
    private issueProductService: IssueProductService
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

  checkBoxItem: Array<any> = [];

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



  // testLog() {

  //   console.log(this.categoryTextValue,
  //     this.isProgram);
  //   console.log(this.productTextValue);

  // }


  getCategoriesProductDataList() {

    this.dropDownService.getCategoryDropDown()
      .pipe(catchError(err => {

        return err
      })).subscribe((res: any) => {

        this.categoryDataList = res
      })

    this.dropDownService.getProductDropDown()
      .pipe(catchError(err => {
        return err
      })).subscribe((res: any) => {
        // console.log(res);

        this.productDataList = res
      })

  }


  onCategoriesSubmit() {

    var data: InsertCategoriesDataModel = {
      IssueCategoriesName: this.categoryTextValue,
      isProgramIssue: this.isProgram


    }

    this.issueProductService.onSaveCategories(data)
      .pipe(catchError(err => { return err }))
      .subscribe((res: any) => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
        this.getCategoriesProductDataList();

        return this.categoryPopupHide()

      })
  }

  onProductSubmit() {

    var data: InsertProductDataModel = {
      productName: this.productTextValue,

    }

    this.issueProductService.onSaveProduct(data)
      .pipe(catchError(err => { return err })).subscribe((res: any) => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
        this.getCategoriesProductDataList();

        return this.productPopupHide()

      })
  }


  onDeleteCategory(data: categoriesDeleteFormData) {

    var newData: categoriesDeleteFormData = {
      issueCategoriesId: data.issueCategoriesId,
      issueCategoriesName: data.issueCategoriesName,
    }


    this.issueProductService.onDeleteCategories(newData)
      .pipe(catchError(err => { return err })).subscribe((res: any) => {
        // console.log(res);
        this.getCategoriesProductDataList();
        Swal.fire({
          title: 'สำเร็จ',
          text: 'ลบข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
      })


  }

  onDeleteProduct(data: ProductDeleteFormData) {

    var newData: ProductDeleteFormData = {
      productId: data.productId,
      productName: data.productName,

    }


    this.issueProductService.onDeleteProduct(newData)
      .pipe(catchError(err => { return err })).subscribe((res: any) => {
        this.getCategoriesProductDataList();
        Swal.fire({
          title: 'สำเร็จ',
          text: 'ลบข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1000
        });
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
    this.editProductFormData.productName = this.editProductText
    this.editProductFormData.modifiedTime = data.modifiedTime;

    // console.log(this.editProductFormData);


  }


  onEditProductPopupHide() {
    this.editProductVisible = false;
    this.editProductFormData = {
      productId: 0,
      productName: "",
      modifiedTime: undefined // Reset modifiedTime
    }
  }

  onEditPopupSubmit() {

    var newData = {
      productId: this.editProductFormData.productId,
      productName: this.editProductText,
      modifiedTime: this.editProductFormData.modifiedTime
    }


    this.issueProductService.onUpdateProduct(newData).pipe(catchError(err => {
      if (err.error && err.error.messages) {
        this.editProductVisible = false;

        return Swal.fire({
          title: 'error',
          text: `บันทึกข้อมูลไม่สำเร็จ: ${err.error.messages.modifiedTime}`,
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

      return err
    })).subscribe((res: any) => {
      this.onEditProductPopupHide();
      this.getCategoriesProductDataList();

      Swal.fire({
        title: 'สำเร็จ',
        text: 'บันทึกข้อมูลสำเร็จ',
        icon: 'success',

        confirmButtonText: 'ตกลง',
        timer: 1000
      });
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
    this.editCategoriesFormData.issueCategoriesName = this.editCategoriesText
    this.editCategoriesFormData.isProgramIssue = data.isProgramIssue
    this.editCategoriesFormData.modifiedTime = data.modifiedTime;

    // console.log(this.editCategoriesFormData);


  }


  onEditCategoriesPopupHide() {
    this.editCategoriesVisible = false;

    this.editCategoriesFormData = {
      issueCategoriesId: 0,
      issueCategoriesName: "",
      isProgramIssue: false,
      modifiedTime: undefined // Reset modifiedTime
    }

  }

  onEditCategoriesPopupSubmit() {

    var newData = {
      issueCategoriesId: this.editCategoriesFormData.issueCategoriesId,
      issueCategoriesName: this.editCategoriesText,
      isProgramIssue: this.editCategoriesFormData.isProgramIssue,
      modifiedTime: this.editCategoriesFormData.modifiedTime
    }



    this.issueProductService.onUpdateCategories(newData).pipe
      (catchError(err => {
        if (err.error && err.error.messages) {
          this.editCategoriesVisible = false;

          return Swal.fire({
            title: 'บันทึกข้อมูลไม่สำเร็จ',
            text: `${err.error.messages.modifiedTime}`,
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

        }); return err
      })).subscribe((res: any) => {
        // console.log(res);
        this.onEditCategoriesPopupHide();
        this.getCategoriesProductDataList();

        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',

          confirmButtonText: 'ตกลง',
          timer: 1000
        });
      })

    // console.log(this.editFormData);

  }

  onAddProduct() {
    // console.log('Button clicked in parent!');
    // ทำงานอื่น ๆ เช่น เปิด popup, call API
  }


  getCheckBoxItem() {
    // this.dropDownService.getCategoryDropDown().pipe(catchError(err => {
    //  this.checkBoxItem = []
    //   return err
    // })).subscribe((res: any[] ) => {

    //   // this.checkBoxItem = res

    //   this.checkBoxItem = res.map(item => ({ ...item, selected: false }));


    // })

    this.dropDownService.getCategoryDropDown()
      .pipe(
        catchError(err => {
          // console.error(err);
          this.categoryDataList = [];
          return of([]);
        })
      )
      .subscribe((res: any) => {
        const resArray = Array.isArray(res) ? res : [];
        this.categoryDataList = resArray.map((item: any) => ({
          ...item,
          selected: false // ✅ กำหนดค่า default false
        }));
      });


  }

  onCategoriesValueCheck(e: any) {

    this.categoriesIdSearch = this.getSelectedCategories();
    // return this.issueProductService.queryCategoriesByText()
  }

  onSearch(){

        this.initProductByNameCategoriesDataSource(this.productSearch, this.categoriesIdSearch)

  }
  categoriesIdSearch: string = "";
  productSearch: string = "";
  ProductByCategoriesDataSource!: DataSource;

  onChangeTest(e: string) {
    this.productSearch = e;
  }

  initProductByNameCategoriesDataSource(productName: string | null = null, categoriesId: string | null = null) {

    this.ProductByCategoriesDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {

        var newLoad: DevExthemeParam<productSearch> = {
          searchCriteria: {
            productName: productName,
            categoriesText: categoriesId
          },

          loadOption: loadOptions
        }
        return this.issueProductService.QueryProductOnCategories(newLoad).pipe(catchError(err => {

          return err
        })).toPromise()

      }
    });
  }


  getSelectedCategories(): string {
    return this.categoryDataList
      .filter(c => c.selected)           // เลือกเฉพาะ selected = true
      .map(c => c.issueCategoriesId)     // ดึง id
      .join(',');                        // รวมเป็น string
  }




}

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api-service.service';
import { DropDownList, ProductsDataModel, UserMapCategoriesViewModel } from '../../models/tag-option.model';
import { MappingCategoriesModel, UnMappingCategoriesModel } from '../../models/mapping.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-map-user-categories',
  templateUrl: './map-user-categories.component.html',
  styleUrls: ['./map-user-categories.component.scss']
})
export class MapUserCategoriesComponent implements OnInit {
  ngOnInit(): void {
    this.getUserByRoleSupport()
    // this.getUnmappedCategoriesItem()
    // this.getMappedCategoriesItem()
  }

  constructor(
    private api: ApiService
  ) { }

  userDataList: any;
  labelUsername: string = 'unknown'
  labelRole: string = 'unknown'
  mapDetailVisible: boolean = false;
  globalId: number = 0;
  unmappedItem: UnMappingCategoriesModel[] = [];
  mappedItem: MappingCategoriesModel[] = []
  categoriesVisible = false;
  categoriesTagDataSource: DropDownList[] = [];
  userMapCategories!: UserMapCategoriesViewModel;
  viewPopupDetail: boolean = false;
  viewUserDetail: Array<string> = [];
  viewUsername: string = '';
  viewRole: string = '';

  getUserByRoleSupport() {
    this.api.get("api/ConfigSupport/userByRole").subscribe({
      next: (res: any) => {
        // console.log("✅ Success:", res);
        this.userDataList = res;
      },
      error: (err) => {
        // console.error("❌ API Error:", err);
      },
      complete: () => {
        // console.log("ℹ️ API call completed");
      }
    });
  }

  onMapDetailPopupHide() {
    this.mapDetailVisible = false;
  }

  onMapDetailPopupShow(data: any) {
    this.globalId = data.userId
    this.labelUsername = data.username
    this.labelRole = data.roleName
    this.getCategoriesForUser(data.userId)
    this.mapDetailVisible = true;

  }
  productPopupHide() {
    this.mapDetailVisible = false
  }

  getViewUserDetail(data: any) {

    var id = data.userId;
    this.viewUsername = data.username;
    this.viewRole = data.roleName;
    this.viewPopupDetail = true;
    this.api.get(`api/ConfigSupport/loadUser/${id}`).subscribe({
      next: (res: UserMapCategoriesViewModel) => {
        this.viewUserDetail = res.categoriesText.split(',').map((item: string) => item.trim());
      }, error: (err) => {
        this.viewUserDetail = [];
      }
    });
  }
  onViewPopupHide() {
    this.viewPopupDetail = false;
  }

  getCategoriesForUser(id: number) {
    this.api.get(`api/ConfigSupport/loadUser/${id}`).subscribe({
      next: (res: UserMapCategoriesViewModel) => {
        this.userMapCategories = res
      }, error: (err) => {
        this.userMapCategories = {
          userId: id,
          categories: [],
          categoriesText: '',
          modifiedTime: null
        };
      }
    });

    this.api.get(`api/DropDown/userMapCategoriesByUserId`).subscribe({
      next: (res: DropDownList[]) => {
        this.categoriesTagDataSource = res
      },
      error: (err) => {
        this.categoriesTagDataSource = [];
      }
    })
  }

  onSaveSubmit() {
    this.api.post(`api/ConfigSupport/InsertMappingUserCategories`, this.userMapCategories).subscribe({
      next: (res: any) => {
        // console.log("✅ Success:", res);
        this.mapDetailVisible = false;
        this.getUserByRoleSupport();
      },
      error: (err) => {
        this.mapDetailVisible = false;
        Swal.fire({
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          text: 'กรุณาลองรีเฟรชหน้าเว็บและลองอีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    })
  }

  onChange(e: any) {
    this.userMapCategories.categories = e.value
    // console.log(e);

  }
}

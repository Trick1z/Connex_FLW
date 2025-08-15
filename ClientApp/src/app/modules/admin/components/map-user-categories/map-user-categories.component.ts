import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api-service.service';
import { DropDownList, ProductsDataModel, UserMapCategoriesViewModel } from '../../models/tag-option.model';
import { MappingCategoriesModel, UnMappingCategoriesModel } from '../../models/mapping.model';

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




  getUserByRoleSupport() {
    this.api.get("api/ConfigSupport/userByRole").subscribe((res: any) => {
      // console.log(res);

      this.userDataList = res
    })

  }
  // label 


  onMapDetailPopupHide() {
    this.mapDetailVisible = false;
  }
  onMapDetailPopupShow(data: any) {
    this.globalId = data.userId
    this.labelUsername = data.username
    this.labelRole = data.roleName

    this.getCategoriesForUser(data.userId)

    this.mapDetailVisible = true;
    // console.log(data);



  }
  productPopupHide() {
    this.mapDetailVisible = false
  }



  categoriesVisible = false;

  categoriesTagDataSource: DropDownList[] = [];
  // categoriesSelectedTags: number[] = [];

  userMapCategories!: UserMapCategoriesViewModel;

  getCategoriesForUser(id: number) {
    // ดึงข้อมูลทั้งหมดจาก backend (รวม mapped/unmapped)
    this.api.get(`api/ConfigSupport/loadUser/${id}`).subscribe((res: UserMapCategoriesViewModel) => {
      this.userMapCategories = res

      // console.log(this.categoriesSelectedTags);


      console.log(res);

    });


    this.api.get(`api/DropDown/userMapCategoriesByUserId`).subscribe((res: DropDownList[]) => {
      // products สำหรับ TagBox

      this.categoriesTagDataSource = res

      // this.categoriesTagDataSource = res.showText.map((res: any) => ({
      //   value : res.issueCategoriesId,
      //   issueCategoriesName: res.issueCategoriesName,
      //   isActive: res.isActive
      // }));

      // ค่าเริ่มต้น selected สำหรับ TagBox
      // this.categoriesSelectedTags = res.selectedCategories.map((c: any) => c.issueCategoriesId);
    });
  }

  onSaveSubmit() {


    // var newData = {
    //   userId: this.globalId,
    //   categoriesId: this.userMapCategories


    // }

    // console.log(this.userMapCategories);



    this.api.post(`api/ConfigSupport/InsertMappingUserCategories`,this.userMapCategories).subscribe((res : any )=>{

      // console.log(res);
      this.productPopupHide() ;

    })
  }

  onChange(e: any) {
this.userMapCategories.categories = e.value
    console.log(e);

  }

  // 
}

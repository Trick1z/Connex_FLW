import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api-service.service';
import { MappingCategoriesModel, SetUserIdUserName, UnMappingCategoriesModel } from '../models/mapping.model';
import { CategoriesDataModel, ProductsDataModel } from '../master/model/tag-option.model';

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
  categoriesTagOptions: CategoriesDataModel[] = [];

  categoriesSelectedTags: number[] = [];

  getCategoriesForUser(id: number) {
    // ดึงข้อมูลทั้งหมดจาก backend (รวม mapped/unmapped)
    this.api.get(`api/DropDown/userMapCategoriesByUserId/${id}`).subscribe((res: any) => {
      // products สำหรับ TagBox
      this.categoriesTagOptions = res.allProducts.map((res: any) => ({
        issueCategoriesId : res.issueCategoriesId,
        issueCategoriesName: res.issueCategoriesName,
        isActive: res.isActive
      }));

      // ค่าเริ่มต้น selected สำหรับ TagBox
      this.categoriesSelectedTags = res.selectedCategories;
    });
  }

  onSaveSubmit(){


     var newData = {
      userId : this.globalId,
      categoriesId : this.categoriesSelectedTags

    }

    
    this.api.post(`api/ConfigSupport/InsertMappingUserCategories`,newData).subscribe((res : any )=>{

      // console.log(res);
      this.productPopupHide() ;
      
    })
  }

  // 
}

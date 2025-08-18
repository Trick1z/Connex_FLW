import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api-service.service';
import { DropDownList, ProductsDataModel, UserMapCategoriesViewModel } from '../../models/tag-option.model';
import { MappingCategoriesModel, UnMappingCategoriesModel } from '../../models/mapping.model';
import Swal from 'sweetalert2';
import { ConfigSupportService } from '../../services/config-support.service';
import { InsertCategoriesDataModel } from '../../models/insert-categories.model';
import { catchError, of } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { DevExthemeParam, usernameSearch } from '../../models/search.Model';

@Component({
  selector: 'app-map-user-categories',
  templateUrl: './map-user-categories.component.html',
  styleUrls: ['./map-user-categories.component.scss']
})
export class MapUserCategoriesComponent implements OnInit {
  ngOnInit(): void {
    this.getUserByRoleSupport()

    // this.userByRoleDataSource = new DataSource({
    //   load: (loadOptions: LoadOptions) => {

    //     var newLoad: usernameSearch = {
    //      text : this.searchUsernameValue,
    //       loadOption : loadOptions
    //     }




    //     return this.service.queryUserByText(newLoad).pipe(catchError(err => {

    //       return err
    //     })).toPromise()

    //   }
    // });

    this.initUserByRoleDataSource();
  }




  constructor(
    private service: ConfigSupportService,
    private dropDownService: DropDownService
  ) { }

  userDataList: any;
  userByRoleDataSource!: DataSource;
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

  searchUsernameValue: string = 'du';

  getUserByRoleSupport() {
    this.service.getUserByRoleSupport().pipe(catchError(err => {

      return err
    })).subscribe((res: any) => {

      this.userDataList = res;
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
    this.service.getCategoriesForUser(id)
      .pipe(catchError(err => {
        this.viewUserDetail = [];

        return err

      }))
      .subscribe((res: any) => {
        this.viewUserDetail = res.categoriesText.split(',').map((item: string) => item.trim());
      })



    this.dropDownService.getUserMapCategoriesDropDown().pipe(catchError(err => {
      return err

    })).subscribe((res: any) => {
      this.categoriesTagDataSource = res

    })
  }

  onViewPopupHide() {
    this.viewPopupDetail = false;
  }

  getCategoriesForUser(id: number) {
    this.service.getCategoriesForUser(id)
      .pipe(catchError(err => {

        this.userMapCategories = {
          userId: id,
          categories: [],
          categoriesText: '',
          modifiedTime: null
        };
        return err

      }))
      .subscribe((res: any) => {
        this.userMapCategories = res
      })
  }

  onSaveSubmit() {
    this.service.insertMappingUserCategories(this.userMapCategories)
      .pipe(catchError(err => {

        this.mapDetailVisible = false;
        Swal.fire({
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          text: 'กรุณาลองรีเฟรชหน้าเว็บและลองอีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });

        return err

      }))
      .subscribe(
        (res: any) => {
          // console.log("✅ Success:", res);
          this.mapDetailVisible = false;
          this.getUserByRoleSupport();
        });


  }

  onChange(e: any) {
    this.userMapCategories.categories = e.value
    // console.log(e);

  }

  initUserByRoleDataSource() {

    this.userByRoleDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {

        var newLoad: DevExthemeParam<usernameSearch> = {

          searchCriteria: { text: this.searchUsernameValue },

          loadOption: loadOptions
        }
        return this.service.queryUserByText(newLoad).pipe(catchError(err => {

          return err
        })).toPromise()

      }
    });
  }


  onSearchValueChange(e: string) {

    this.searchUsernameValue = e

    this.initUserByRoleDataSource();

  }

}

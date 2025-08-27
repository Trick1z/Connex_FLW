import { Component, OnInit, ViewChild } from '@angular/core';
import { UserMapCategoriesViewModel } from '../../models/tag-option.model';
import { MappingCategoriesModel, UnMappingCategoriesModel } from '../../models/mapping.model';
import Swal from 'sweetalert2';
import { ConfigSupportService } from '../../services/config-support.service';
import { catchError, of } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam, Search } from '../../models/search.Model';
import { DropDownList } from 'src/app/models/dropDown.model';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-map-user-categories',
  templateUrl: './map-user-categories.component.html',
  styleUrls: ['./map-user-categories.component.scss']
})
export class MapUserCategoriesComponent implements OnInit {
  viewPopupDetail = false;
  mapDetailVisible = false;

  userByRoleDataSource!: DataSource;
  userMapCategories!: UserMapCategoriesViewModel;

  categoriesTagDataSource: DropDownList[] = [];
  viewUserDetail: string[] = [];

  viewUsername = '';
  viewRole = '';
  searchUsernameValue = '';
  labelUsername = 'unknown';
  labelRole = 'unknown';
  globalId = 0;


  @ViewChild('userGrid', { static: false }) public userGrid!: DxDataGridComponent;

  constructor(
    private service: ConfigSupportService,
    private dropDownService: DropDownService
  ) { }

  ngOnInit(): void {
    this.initUserByRoleDataSource();
  }
  onChange(e: any) { this.userMapCategories.categories = e.value; }

  initUserByRoleDataSource(text: string | null = null) {
    this.userByRoleDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<Search> = {
          searchCriteria: { text },
          loadOption: loadOptions
        };
        return this.service.queryUserByText(newLoad)
          .pipe(catchError(err => {
            return of([]);
          }))
          .toPromise();
      }
    });
  }

  onSearchValueChange(text: string) {
    this.searchUsernameValue = text;

  }
  refreshGrid() {
    if (this.userGrid?.instance) {
      this.userGrid.instance.refresh();
    }
  }

  onSearch() {
    this.initUserByRoleDataSource(this.searchUsernameValue); 
    this.refreshGrid();                   
  }

  onMapDetailPopupShow(data: any) {
    this.loadUserCategories(data.id);
    this.getCategoriesForUser(data.userId);
    this.loadCategoriesDropdown();
    this.labelUsername = data.username;
    this.labelRole = data.roleName;
    this.mapDetailVisible = true;
  }

  onMapDetailPopupHide() { this.mapDetailVisible = false; }

  getCategoriesForUser(id: number) {
    this.service.getCategoriesForUser(id)
      .pipe(catchError(err => {
        this.userMapCategories = { userId: id, categories: [], categoriesText: '', modifiedTime: null };
        return of(this.userMapCategories);
      }))
      .subscribe((res: any) => { this.userMapCategories = res; });
  }

  onSaveSubmit() {
    this.service.insertMappingUserCategories(this.userMapCategories)
      .pipe(catchError(err => {
        this.mapDetailVisible = false;
        Swal.fire('ไม่สามารถบันทึกข้อมูลได้', 'กรุณาลองรีเฟรชหน้าเว็บและลองอีกครั้ง', 'error');
        return of(null);
      }))
      .subscribe(res => {
        // this.initUserByRoleDataSource(this.searchUsernameValue);
        this.userGrid.instance.refresh()
        Swal.fire('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
        this.mapDetailVisible = false;
      });
  }


  getViewUserDetail(data: any) {
    const id = data.userId;
    this.viewUsername = data.username;
    this.viewRole = data.roleName;
    this.viewPopupDetail = true;
    this.loadUserCategories(id);
    this.loadCategoriesDropdown();
  }

  loadUserCategories(userId: number) {
    this.service.getCategoriesForUser(userId)
      .pipe(catchError(err => {
        this.viewUserDetail = [];
        return of({ categoriesText: '' });
      }))
      .subscribe((res: any) => {
        this.viewUserDetail = res.categoriesText?.split(',').map((item: string) => item.trim()) || [];
      });
  }

  loadCategoriesDropdown() {
    this.dropDownService.getUserMapCategoriesDropDown()
      .pipe(catchError(err => {
        return of([]);
      }))
      .subscribe((res: any[]) => this.categoriesTagDataSource = res);
  }

  onViewPopupHide() { this.mapDetailVisible = false; }
}

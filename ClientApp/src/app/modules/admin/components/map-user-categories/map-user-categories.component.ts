import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-map-user-categories',
  templateUrl: './map-user-categories.component.html',
  styleUrls: ['./map-user-categories.component.scss']
})
export class MapUserCategoriesComponent implements OnInit {

  userByRoleDataSource!: DataSource;
  categoriesTagDataSource: DropDownList[] = [];

  labelUsername = 'unknown';
  labelRole = 'unknown';
  mapDetailVisible = false;
  globalId = 0;

  userMapCategories!: UserMapCategoriesViewModel;

  viewPopupDetail = false;
  viewUserDetail: string[] = [];
  viewUsername = '';
  viewRole = '';

  searchUsernameValue = '';

  constructor(
    private service: ConfigSupportService,
    private dropDownService: DropDownService
  ) { }

  ngOnInit(): void {
    this.initUserByRoleDataSource();
  }

  // ================= DataSource =================
  initUserByRoleDataSource(text: string | null = null) {
    this.userByRoleDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<Search> = {
          searchCriteria: { text },
          loadOption: loadOptions
        };
        return this.service.queryUserByText(newLoad)
          .pipe(catchError(err => {
            console.error(err);
            return of([]);
          }))
          .toPromise();
      }
    });
  }

  onSearchValueChange(text: string) {
    this.searchUsernameValue = text;
    this.initUserByRoleDataSource(this.searchUsernameValue);
  }

  // ================= Map Detail =================
  onMapDetailPopupShow(data: any) {
    // โหลด categories ของ user
    this.loadUserCategories(data.id);

    // โหลด dropdown categories
    this.loadCategoriesDropdown();
    this.globalId = data.userId;
    this.labelUsername = data.username;
    this.labelRole = data.roleName;
    this.getCategoriesForUser(data.userId);
    this.mapDetailVisible = true;
  }

  onMapDetailPopupHide() { this.mapDetailVisible = false; }

  getCategoriesForUser(id: number) {
    this.service.getCategoriesForUser(id)
      .pipe(catchError(err => {
        console.error(err);
        this.userMapCategories = { userId: id, categories: [], categoriesText: '', modifiedTime: null };
        return of(this.userMapCategories);
      }))
      .subscribe((res: any) => { this.userMapCategories = res; });
  }

  onSaveSubmit() {
    this.service.insertMappingUserCategories(this.userMapCategories)
      .pipe(catchError(err => {
        console.error(err);
        this.mapDetailVisible = false;
        Swal.fire('ไม่สามารถบันทึกข้อมูลได้', 'กรุณาลองรีเฟรชหน้าเว็บและลองอีกครั้ง', 'error');
        return of(null);
      }))
      .subscribe(res => {
        if (res) {
          this.mapDetailVisible = false;
          this.initUserByRoleDataSource(this.searchUsernameValue);
          Swal.fire('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
        }
      });
  }

  onChange(e: any) { this.userMapCategories.categories = e.value; }

  // ================= View User Detail =================
  // ================= View User Detail =================
  getViewUserDetail(data: any) {
    const id = data.userId;
    this.viewUsername = data.username;
    this.viewRole = data.roleName;
    this.viewPopupDetail = true;

    // โหลด categories ของ user
    this.loadUserCategories(id);

    // โหลด dropdown categories
    this.loadCategoriesDropdown();
  }

  // แยกโหลด categories ของ user
  loadUserCategories(userId: number) {
    this.service.getCategoriesForUser(userId)
      .pipe(catchError(err => {
        console.error(err);
        this.viewUserDetail = [];
        return of({ categoriesText: '' });
      }))
      .subscribe((res: any) => {
        this.viewUserDetail = res.categoriesText?.split(',').map((item: string) => item.trim()) || [];
      });
  }

  // แยกโหลด dropdown categories
  loadCategoriesDropdown() {
    this.dropDownService.getUserMapCategoriesDropDown()
      .pipe(catchError(err => {
        console.error(err);
        return of([]);
      }))
      .subscribe((res: any[]) => this.categoriesTagDataSource = res);
  }

  onViewPopupHide() { this.viewPopupDetail = false; }
}

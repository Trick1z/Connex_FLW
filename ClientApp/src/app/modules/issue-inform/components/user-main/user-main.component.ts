import { Component, OnInit, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { InformTaskService } from '../../services/inform-task.service';
import { CheckboxService } from '../../../../services/checkbox.service';
import { CheckboxList } from 'src/app/models/checkBox.model';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam } from 'src/app/modules/admin/models/search.Model';
import { QueryUserForm, QueryUserFormDetail, TaskLogParam, USP_Query_FormTaskDetailResult, USP_Query_IssueFormsResult } from '../../models/inform.model';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import { Router } from '@angular/router';
import { UserRoute } from 'src/app/constants/routes.const';
import Swal from 'sweetalert2';
import { Button, HeaderUnderline } from 'src/app/constants/color.const';
import { SwalService } from '../../../admin/services/swal.service';
import { Alert } from 'src/app/constants/alert.const';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {

  buttonColor = Button;
  underlineColor = HeaderUnderline;

  openFormsDataSource!: DataSource;
  closedFormsDataSource!: DataSource;
  isTaskPopupVisible: boolean = false;
  documentNumberSearch: string | null = null;
  productName: string | null = null;
  categoriesSearchId: string | null = null;
  statusCodeSearchText: string | null = null;
  startDate: Date | null = null;;
  endDate: Date | null = null;;
  taskLogDetail: any = [];
  taskDetailCache: { [formId: number]: USP_Query_FormTaskDetailResult[] } = {};
  categoriesCheckBoxItem: CheckboxList<number>[] = [];
  statusCheckBoxItem: CheckboxList<string>[] = [];

  @ViewChild('openFormGrid', { static: false }) openFormGrid!: DxDataGridComponent;
  @ViewChild('closedFormGrid', { static: false }) closedFormGrid!: DxDataGridComponent;

  constructor(
    private informTaskService: InformTaskService,
    private checkboxService: CheckboxService,
    private router: Router,
    private swalService: SwalService
  ) { }

  ngOnInit(): void {
    this.initOpenFormsDataSource()
    this.initClosedFormsDataSource()
    this.initCategoriesCheckBox();
    this.initStatusCheckBox();
  }

  onDocumentChange(e: any) {
    this.documentNumberSearch = e
  }
  onProductNameChange(e: any) {
    this.productName = e
  }

  onCategoriesCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);
    this.categoriesSearchId = selectedItems.length > 0 ? selectedItems.join(',') : null;
  }

  onStatusCodeCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);
    this.statusCodeSearchText = selectedItems.length > 0 ? selectedItems.join(',') : null;
  }

  onStartDateChange(e: any) {
    this.startDate = e.value;
  }

  onEndDateChange(e: any) {
    this.endDate = e.value
  }

  onSearchClicked() {
    this.refreshGrid()
  }

  async initCategoriesCheckBox(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.checkboxService.getCategoriesCheckBoxItem()
      );
      this.categoriesCheckBoxItem = res as CheckboxList<number>[];
    } catch (error) {
      this.categoriesCheckBoxItem = [];
    }
  }

  async initStatusCheckBox() {
    try {
      const res = await firstValueFrom(this.checkboxService.getStatusCodeCheckBoxItem()) as CheckboxList<string>[];
      this.statusCheckBoxItem = res;
    } catch (err) {
      this.statusCheckBoxItem = [];
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'text-gray-500 font-bold';
      case 'Rejected': return 'text-red-600 font-bold';
      case 'Submit': return 'text-blue-600 font-bold';
      case 'InProgress': return 'text-yellow-600 font-bold';
      case 'Done': return 'text-green-600 font-bold';
      case 'Closed': return 'text-green-600 font-bold';
      case 'Assigned': return 'text-amber-600 font-bold';

      default: return 'text-gray-600';
    }
  }

  getActionClass(status: string): string {
    switch (status) {
      case 'Rejected': return 'text-red-600 font-bold';
      case 'Assigned': return 'text-yellow-600 font-bold';
      case 'Created Task': return 'text-blue-600 font-bold';
      default: return 'text-gray-600';
    }
  }

  initOpenFormsDataSource() {
    this.openFormsDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<QueryUserForm> = {
          searchCriteria: {
            docNo: this.documentNumberSearch,
            productName: this.productName,
            categories: this.categoriesSearchId,
            statusCode: this.statusCodeSearchText,
            startDate: this.startDate,
            endDate: this.endDate
          },
          loadOption: loadOptions
        };
        return this.informTaskService.getUnsuccessInform(newLoad, 'Open')
          .pipe(catchError(err => { return err }))
          .toPromise()
      }
    });
  }

  initClosedFormsDataSource() {
    this.closedFormsDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<QueryUserForm> = {
          searchCriteria: {
            docNo: this.documentNumberSearch,
            productName: this.productName,
            categories: this.categoriesSearchId,
            statusCode: this.statusCodeSearchText,
            startDate: this.startDate,
            endDate: this.endDate
          },
          loadOption: loadOptions
        };
        return this.informTaskService.getUnsuccessInform(newLoad, 'Closed')
          .pipe(catchError(err => { return err }))
          .toPromise()
      }
    });
  }

  onDetailGridContentReady(e: any, formId: number) {
    const detailGrid = e.component;
    if (this.taskDetailCache[formId]) {
      return;
    }
    const allTask: USP_Query_FormTaskDetailResult[] = Object.values(this.taskDetailCache).flat();
    const newLoad: DevExtremeParam<QueryUserFormDetail> = {
      searchCriteria: {
        formId: formId,
        dataSource: allTask
      },
      loadOption: {} as LoadOptions
    };
    this.informTaskService.getUnsuccessInformDetail(newLoad)
      .pipe(
        catchError(err => {
          return of({ data: [], totalCount: 0 });
        })).subscribe((res: any) => {
          this.taskDetailCache[formId] = res?.data ?? [];
          detailGrid.option('dataSource', this.taskDetailCache[formId]);
        });
  }

  onCloseFormClicked(data: any) {
    Swal.fire({
      title: "Are you sure?",
      text: `ต้องการปิดงาน ${data.docNo} ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.informTaskService.closeInformTask(data).pipe(catchError(err => {
          this.swalService.showErrorLog(err)
          return err
        })).subscribe((res: any) => {
          this.refreshGrid()
          return this.swalService.showSuccessPopup(Alert.saveSuccessfully)
        })
      }
      return
    });
  }

  TaskLogPopupCloseClicked() { this.isTaskPopupVisible = false; }
  onEditClicked(data: USP_Query_IssueFormsResult) { this.router.navigate([`${UserRoute.UserEditFormFullPath}/${data.formId}`]) }

  refreshGrid() {
    this.openFormGrid.instance.refresh()
    this.closedFormGrid.instance.refresh()
  }

  onFormDeleteClicked(data: any) {
    Swal.fire({
      title: "Are you sure?",
      text: `ต้องการลบงาน ${data.docNo} ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.informTaskService.deleteInformTask(data).pipe(catchError(err => {
          this.swalService.showErrorLog(err)
          return err
        })).subscribe((res: any) => {
          this.swalService.showSuccessPopup(Alert.deleteSuccessfully)

          this.refreshGrid()
        })
      }
      return
    });
  }

  TaskLogPopupOpenClicked(data: TaskLogParam) {
    this.loadTaskLog(data);
    this.isTaskPopupVisible = true;
  }

  loadTaskLog(data: TaskLogParam) {
    var newLoad = {
      formId: data.formId,
      taskSeq: data.taskSeq
    }
    return this.informTaskService.queryTaskLog(newLoad)
      .pipe(catchError(err => { return err }))
      .subscribe((res: any) => {
        this.taskLogDetail = res.data
      })
  }
}

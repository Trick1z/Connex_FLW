import { Component, OnInit, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { InformTaskService } from '../../services/inform-task.service';
import { CheckboxService } from '../../../../services/checkbox.service';
import { CheckboxList } from 'src/app/models/checkBox.model';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam } from 'src/app/modules/admin/models/search.Model';
import { QueryUserForm, QueryUserFormDetail, USP_Query_FormTaskDetailResult, USP_Query_IssueFormsResult } from '../../models/inform.model';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import { Router } from '@angular/router';
import { UserRoute } from 'src/app/constants/routes.const';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {

  openFormsDataSource!: DataSource;
  closedFormsDataSource!: DataSource;


  documentNumberSearch: string | null = null;
  productName: string | null = null;
  categoriesSearchId: string | null = null;
  statusCodeSearchText: string | null = null;
  startDate: Date | null = null;;
  endDate: Date | null = null;;
  taskDetailCache: { [formId: number]: USP_Query_FormTaskDetailResult[] } = {};
  categoriesCheckBoxItem: CheckboxList<number>[] = [];
  statusCheckBoxItem: CheckboxList<string>[] = [];

  @ViewChild('openFormGrid', { static: false }) openFormGrid!: DxDataGridComponent;
  @ViewChild('closedFormGrid', { static: false }) closedFormGrid!: DxDataGridComponent;
  
  constructor(
    private informTaskService: InformTaskService,
    private checkboxService: CheckboxService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initOpenFormsDataSource()
    this.initClosedFormsDataSource()
    this.initCategoriesCheckBox();
    this.initStatusCheckBox();
  }

  onDocumentChange(e: any) {
    this.documentNumberSearch = e
    this.refreshGrid()
  }
  onProductNameChange(e: any) {
    this.productName = e
    this.refreshGrid()
  }

  onCategoriesCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);
    this.categoriesSearchId = selectedItems.length > 0 ? selectedItems.join(',') : null;
    this.refreshGrid()
  }

  onStatusCodeCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);
    this.statusCodeSearchText = selectedItems.length > 0 ? selectedItems.join(',') : null;
    this.refreshGrid()
  }

  onStartDateChange(e: any) {
    this.startDate = e.value;
    this.refreshGrid()
  }
  onEndDateChange(e: any) {
    this.endDate = e.value
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
        })
      )
      .subscribe((res: any) => {
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
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${err?.error?.messages.time ?? "มีบางอย่างผิดพลาด"} "`,
            showConfirmButton: false,
            timer: 2000
          });

          return err
        })).subscribe((res: any) => {
          this.refreshGrid()

          return Swal.fire({
            title: "สำเร็จ !",
            text: `ปิดงาน ${data.docNo} เสำเร็จแล้ว`,
            icon: "success"
          });
        })
      }
      return
    });
  }

  onEditClicked(data: USP_Query_IssueFormsResult) {
    this.router.navigate([`${UserRoute.UserEditFormFullPath}/${data.formId}`])
  }

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
          Swal.fire({
            position: "center",
            icon: "warning",
            title: err?.error?.messages?.item ?? "มีบางอย่างผิดพลาด",
            showConfirmButton: false,
            timer: 2000
          });
          return err

        })).subscribe((res: any) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "ลบงานสำเร็จ",
            showConfirmButton: false,
            timer: 2000
          });
          this.refreshGrid()
        })
      }
      return
    });
  }
}

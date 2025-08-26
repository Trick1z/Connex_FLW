import { Component, OnInit, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { InformTaskService } from '../../services/inform-task.service';
import { CheckboxService } from '../../../../services/checkbox.service';
import { CheckboxList } from 'src/app/models/checkBox.model';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam } from 'src/app/modules/admin/models/search.Model';
import { QueryUserForm, QueryUserFormDetail, USP_Query_FormTaskDetailResult } from '../../models/inform.model';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {

  // =================== DataSources ===================
  openFormsDataSource!: DataSource;
  closedFormsDataSource!: DataSource;

  // =================== Search / Filters ===================
  documentNumberSearch: string | null = null;
  productName: string | null = null;
  categoriesSearchId: string | null = null;
  statusCodeSearchText: string | null = null;
  startDate: Date | null = null;;
  endDate: Date | null = null;;
  taskDetailCache:
    { [formId: number]: USP_Query_FormTaskDetailResult[] } = {};


  categoriesCheckBoxItem: CheckboxList<number>[] = [];
  statusCheckBoxItem: CheckboxList<string>[] = [];


  @ViewChild('openFormGrid', { static: false }) openFormGrid!: DxDataGridComponent;
  constructor(
    private informTaskService: InformTaskService,
    private checkboxService: CheckboxService
  ) { }

  // =================== Init ===================
  ngOnInit(): void {

    this.initOpenFormsDataSource()
    this.initClosedFormsDataSource()
    this.loadCategories();

    this.loadStatusCode();
  }

  onDocumentChange(e: any) {
    this.documentNumberSearch = e
    // this.initOpenFormsDataSource()
    this.openFormGrid.instance.refresh()

  }
  onProductNameChange(e: any) {
    this.productName = e
    // this.initOpenFormsDataSource()
        this.openFormGrid.instance.refresh()



  }

  onCategoriesCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);

    this.categoriesSearchId = selectedItems.length > 0 ? selectedItems.join(',') : null;
    // this.initOpenFormsDataSource()
        this.openFormGrid.instance.refresh()


  }

  onStatusCodeCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);

    this.statusCodeSearchText = selectedItems.length > 0 ? selectedItems.join(',') : null;
    // this.initOpenFormsDataSource()
        this.openFormGrid.instance.refresh()



  }

  onStartDateChange(e: any) {
    this.startDate = e.value
    // this.initOpenFormsDataSource()
        this.openFormGrid.instance.refresh()


  }
  onEndDateChange(e: any) {
    this.endDate = e.value
    // this.initOpenFormsDataSource()
        this.openFormGrid.instance.refresh()

  }


  // =================== Load CheckBox ===================
  async loadCategories(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.checkboxService.getCategoriesCheckBoxItem()
      );
      this.categoriesCheckBoxItem = res as CheckboxList<number>[];
    } catch (error) {
      this.categoriesCheckBoxItem = [];
    }
  }

  async loadStatusCode() {
    try {
      const res = await firstValueFrom(this.checkboxService.getStatusCodeCheckBoxItem()) as CheckboxList<string>[];
      this.statusCheckBoxItem = res;
    } catch (err) {
      this.statusCheckBoxItem = [];
    }
  }



  // =================== Load Status ===================
  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'text-gray-500 font-bold';
      case 'Rejected': return 'text-red-600 font-bold';
      case 'Submit': return 'text-yellow-600 font-bold';
      case 'InProgress': return 'text-yellow-600 font-bold';
      case 'Done': return 'text-green-600 font-bold';
      default: return 'text-gray-600';
    }
  }

  // =================== Load Data ===================
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
  // work
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


        // กำหนด DataSource ให้ detail grid
        detailGrid.option('dataSource', this.taskDetailCache[formId]);
      });
  }


  // public getDataSourceById(formId: number) {

  //   // console.log(formId);
    
  //   var temp = this.taskDetailCache[formId] ?? []

  //   return this.taskDetailCache[formId]
  // }


  onCloseFormClicked(data: any) {


    console.log("data", data);

    return this.informTaskService.closeInformTask(data).pipe(catchError(err => {

      return err
    })).subscribe((res: any) => {

      // this.initOpenFormsDataSource()
          this.openFormGrid.instance.refresh()

      this.initClosedFormsDataSource()
    })

  }
  //endwork



  // =================== Method ===================



}

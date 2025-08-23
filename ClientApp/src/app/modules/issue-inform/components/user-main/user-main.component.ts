import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { InformTaskService } from '../../services/inform-task.service';
import { CheckboxService } from '../../../../services/checkbox.service';
import { CheckboxList } from 'src/app/models/checkBox.model';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam } from 'src/app/modules/admin/models/search.Model';
import { QueryUserForm } from '../../models/inform.model';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {

  // =================== DataSources ===================
  unsuccessDataSource!: DataSource;
  successDataSource!: DataSource;

  // =================== Search / Filters ===================
  documentNumberSearch: string | null = null;
  productName: string | null = null;
  categoriesSearchId: string | null = null;
  statusCodeSearchText: string | null = null;
  startDate: Date | null = null;;
  endDate: Date | null = null;;


  categoriesCheckBoxItem: CheckboxList<number>[] = [];
  statusCheckBoxItem: CheckboxList<string>[] = [];

  constructor(
    private informTaskService: InformTaskService,
    private checkboxService: CheckboxService
  ) { }

  // =================== Init ===================
  ngOnInit(): void {


    this.initUnassignedTaskDataSource()
    this.loadCategories();

    this.loadStatusCode();
  }

  onDocumentChange(e: any) {
    this.documentNumberSearch = e
    this.initUnassignedTaskDataSource()

  }
  onProductNameChange(e: any) {
    this.productName = e
    this.initUnassignedTaskDataSource()


  }

  onCategoriesCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);

    this.categoriesSearchId = selectedItems.length > 0 ? selectedItems.join(',') : null;
    this.initUnassignedTaskDataSource()

  }

  onStatusCodeCheck(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);

    this.statusCodeSearchText = selectedItems.length > 0 ? selectedItems.join(',') : null;
    this.initUnassignedTaskDataSource()


  }

  onStartDateChange(e: any) {
    this.startDate = e.value
    this.initUnassignedTaskDataSource()

  }
  onEndDateChange(e: any) {
    this.endDate = e.value
    this.initUnassignedTaskDataSource()
  }


  // =================== Load CheckBox ===================
  async loadCategories(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.checkboxService.getCategoriesCheckBoxItem()
      );
      this.categoriesCheckBoxItem = res as CheckboxList<number>[];
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categoriesCheckBoxItem = [];
    }
  }

  async loadStatusCode() {
    try {
      const res = await firstValueFrom(this.checkboxService.getStatusCodeCheckBoxItem()) as CheckboxList<string>[];
      this.statusCheckBoxItem = res;
    } catch (err) {
      console.error('Error loading status code', err);
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
  initUnassignedTaskDataSource() {
    this.unsuccessDataSource = new DataSource({
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


        return this.informTaskService.getUnsuccessInform(newLoad).pipe(catchError(err => { return err }))
          .toPromise()
      }
    });
  }



  // =================== Method ===================


  test(data:any){

    console.log(data);
    
  }

}

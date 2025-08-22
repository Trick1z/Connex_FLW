import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { firstValueFrom } from 'rxjs';
import { InformTaskService } from '../../services/inform-task.service';
import { CheckboxService } from '../../../../services/checkbox.service';
import { CheckboxList } from 'src/app/models/checkBox.model';

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
  documentNumberSearch: string = "";
  productName: string = "";
  categoriesCheckBoxItem: CheckboxList<number>[]= [];       
  statusCheckBoxItem: CheckboxList<string>[] = [];   

  constructor(
    private informTaskService: InformTaskService,
    private checkboxService: CheckboxService
  ) { }

  // =================== Init ===================
  ngOnInit(): void {
    this.loadUnsuccessData();
    // this.loadSuccessData(); // ถ้าต้องการโหลด Success

    // this.loadStatusOptions();
    this.loadCategories();

    this.loadStatusCode();
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

  onCategoriesCheck(e: any) {
    console.log('Categories checked:', e);
  }

  // =================== Load Status ===================
  // loadStatusOptions() {
  //   this.statusCheckBoxItem = [
  //     { code: "Done", text: 'Done', selected: false },
  //     { code: "Rejected", text: 'Rejected', selected: false },
  //     { code: "New", text: 'New', selected: false },
  //     { code: "Draft", text: 'Draft', selected: false }
  //   ];
  // }

  onStatusCheck(e: any) {
    console.log('Status checked:', e);
  }

  onSearchChange(e: any) {
    console.log('Search value changed:', e);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'text-gray-500 font-bold';
      case 'Rejected': return 'text-red-600 font-bold';
      case 'Pending': return 'text-yellow-600 font-bold';
      case 'InProgress': return 'text-yellow-600 font-bold';
      case 'Completed': return 'text-green-600 font-bold';
      default: return 'text-gray-600';
    }
  }

  // =================== Load Data ===================
  loadUnsuccessData() {
    firstValueFrom(this.informTaskService.getUnsuccessInform())
      .then((data: any) => {
        this.unsuccessDataSource = new DataSource({
          store: new ArrayStore({
            key: 'formId',
            data: data || []
          })
        });
      })
      .catch((err) => {
        console.error('Error loading unsuccess data:', err);
        this.unsuccessDataSource = new DataSource({
          store: new ArrayStore({ key: 'formId', data: [] })
        });
      });
  }

  // =================== Load Success (commented) ===================
  // loadSuccessData() {
  //   this.successDataSource = new DataSource({
  //     store: new ArrayStore({
  //       key: 'formId',
  //       load: async () => {
  //         try {
  //           const data: any = await firstValueFrom(this.getSuccessInform());
  //           return data;
  //         } catch (err) {
  //           console.error('Error loading success data:', err);
  //           return [];
  //         }
  //       }
  //     })
  //   });
  // }

}

import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IssueProductService } from 'src/app/modules/admin/services/issue-product.service';
import { InformTaskService } from '../../services/inform-task.service';
import { CheckboxService } from '../../../../services/checkbox.service';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {

  unsuccessDataSource!: DataSource;
  successDataSource!: DataSource;

  documentNumberSearch: string = "";
  productName: string = "";
  options: any = []
  statusOptions: any = []
  constructor(
    private informTaskService: InformTaskService,
    private checkboxService: CheckboxService
  ) { }

  ngOnInit(): void {
    this.loadUnsuccessData();
    // this.loadSuccessData();

    this.loadStatusOptions()
    this.loadCategories()
  }

  async loadCategories() {
    try {
      const res = await firstValueFrom(this.checkboxService.getCategoriesCheckBoxItem());
      this.options = res;
    } catch (err) {
      console.error('Error loading categories', err);
      this.options = [];
    }
  }


  onCategoriesCheck(e: any) {

    console.log(e);

  }

  onStatusCheck(e: any) {
    console.log(e);



  }

   onSearchChange(e: any) {
    console.log(e);



  }



  loadStatusOptions() {
    this.statusOptions = [
      { code: "Done", text: 'Done', selected: false },
      { code: "Rejected", text: 'Rejected', selected: false },
      { code: "New", text: 'New', selected: false },
      { code: "Draft", text: 'Draft', selected: false }
    ];
  }



  // Load DataSource สำหรับ Unsuccess
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
          store: new ArrayStore({
            key: 'formId',
            data: []
          })
        });
      });
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

  // Load DataSource สำหรับ Success
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

// import { Component, OnInit } from '@angular/core';
// import { catchError } from 'rxjs';
// import { DropDownService } from 'src/app/services/drop-down.service';
// import { Router } from '@angular/router';
// import { ViewsRoute } from 'src/app/constants/routes.const';
// import { Action } from 'rxjs/internal/scheduler/Action';
// import { CheckboxService } from 'src/app/services/checkbox.service';
// import { CheckAccessService } from 'src/app/services/check-access.service';

// @Component({
//   selector: 'app-user-main',
//   templateUrl: './user-main.component.html',
//   styleUrls: ['./user-main.component.scss']
// })
// export class UserMainComponent implements OnInit {
//   FieldDocNo: any;
//   ProductName: string = "temp";

//   ngOnInit(): void {
//     this.getCategoriesCheckBox();
//   }
//   constructor(
//     private categoriesDropDownService: DropDownService,
//     private checkAccessService: CheckAccessService,
//     private route: Router,
//     private CheckBoxService: CheckboxService
//   ) { }
//   orders = [
//     {
//       docNo: 1, status: 'New', progressing: "2/5", modifiedBy: 1,

//       modifiedTime: new Date('2023-10-01T10:00:00'),

//     },
//     {
//       docNo: 2, status: 'In Progress', progressing: "2/6", modifiedBy: 2,
//       modifiedTime: new Date('2023-10-02T11:00:00')
//     },
//     {
//       docNo: 3, status: 'Completed', progressing: "5/6", modifiedBy: 3,
//       modifiedTime: new Date('2023-10-03T12:00:00')
//     }
//   ];

//   orderItems = [
//     { docNo: 1, taskId: 1, issuecategoriesName: "borrow", productName: "Laptop", status: "create", ActionBy: 1, ActionTime: new Date('2023-10-01T10:00:00') },
//     { docNo: 2, taskId: 2, issuecategoriesName: "repair", productName: "Phone", status: "create", ActionBy: 2, ActionTime: new Date('2023-10-02T11:00:00') },
//     { docNo: 3, taskId: 3, issuecategoriesName: "IT", productName: "Mouse", status: "create", ActionBy: 3, ActionTime: new Date('2023-10-03T12:00:00') }
//   ];

  

//   options: any = [

//   ]; rejectPopupState: boolean = false;
//   historyPopupState: boolean = false;
//   statusOptions = [
//     { id: 1, text: 'New', selected: false },
//     { id: 2, text: 'Process', selected: false }
//   ];
//   historyItem: any = [{ docNo: 1, action: "Reject", issueCategoriesName: "borrow", productName: "Laptop", status: "create", actionBy: 1, actionTime: new Date('2023-10-01T10:00:00') }] ;

//   getOrderItems(docNo: number) {
//     return this.orderItems.filter(item => item.docNo === docNo);
//   }



//   onRowClick(e: any) {
//     // console.log('Row clicked:', e.data);
//   }





//   getCategoriesCheckBox() {
//     return this.CheckBoxService.getCategoriesCheckBoxItem().pipe(catchError(err => {
//       this.options = [];
//       return err;
//     })).subscribe((res: any) => {


//       this.options = res

//       console.log(this.options);

//       // console.log(res);

//     })
//   }


//   onOptionsChanged(updatedOptions: any[]) {
//     // console.log('Selected options:', updatedOptions.filter(o => o.selected));
//   }

//   onStatusOptionsChanged(updatedOptions: any[]) {
//     // console.log('Selected options:', updatedOptions.filter(o => o.selected));
//   }

//   navTo(path: string) {


//     this.checkAccessService.CheckAccess(path).pipe(catchError(err => {

//       return err;
//     })).subscribe((res: any) => {
//       // Handle onCheckAccess navigation
//       console.log(res);

//       if (res.allowed) {
//         return this.route.navigate([`/${path}`]);
//       }

//       return this.route.navigate([ViewsRoute.LandingFullPath]);

//     });
//   }


//   onRejectViewPopupHide() {

//     this.rejectPopupState = false;
//   }

//   onHistoryViewPopupHide() {

//     this.historyPopupState = false;
//   }

// }


import { Component, OnInit } from '@angular/core';
import { catchError, firstValueFrom } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';
import { Router } from '@angular/router';
import { CheckboxService } from 'src/app/services/checkbox.service';
import { CheckAccessService } from 'src/app/services/check-access.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {
  FieldDocNo: any;
  ProductName: string = "temp";

  orders: any[] = [];
  orderItems: any[] = [];
  options: any[] = [];
  statusOptions = [
    { id: 1, text: 'New', selected: false },
    { id: 2, text: 'Process', selected: false }
  ];
  rejectPopupState: boolean = false;
  historyPopupState: boolean = false;
  historyItem: any[] = [];

  // DevExtreme DataSources
  ordersDataSource!: DataSource;
  orderItemsDataSource!: DataSource;

  constructor(
    private categoriesDropDownService: DropDownService,
    private checkAccessService: CheckAccessService,
    private route: Router,
    private CheckBoxService: CheckboxService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.getCategoriesCheckBox();
  }

  loadOrders() {
    // JSON ตัวอย่างที่คุณให้มา
    const res = {
      "docNo": "6805015",
      "formId": 3,
      "statusCode": "Draft",
      "createdBy": 1,
      "createdTime": "2025-08-21T12:05:27.723",
      "modifiedBy": 1,
      "modifiedTime": "2025-08-21T12:13:12.743",
      "taskItems": [
        {
          "id": "92aac3a0-6bd0-4899-a9e7-e04fc1d40bac",
          "issueCategoriesId": 1,
          "issueCategoriesName": "borrow",
          "productId": 3,
          "productName": "table",
          "quantity": 1,
          "location": null,
          "detectedTime": null
        },
        {
          "id": "71c32dbb-d5c5-46e1-896d-2bf329e0e32f",
          "issueCategoriesId": 1,
          "issueCategoriesName": "borrow",
          "productId": 2,
          "productName": "keyboards",
          "quantity": 1,
          "location": null,
          "detectedTime": null
        },
        {
          "id": "baa61612-9193-4978-a876-89a477b2a42c",
          "issueCategoriesId": 3,
          "issueCategoriesName": "program",
          "productId": 10,
          "productName": "chrome",
          "quantity": null,
          "location": null,
          "detectedTime": "2025-08-02T05:05:19.787"
        }
      ]
    };

    // Master: orders (group by docNo)
    this.orders = [
      {
        docNo: res.docNo,
        status: res.statusCode,
        progressing: `${res.taskItems.filter(t => t.issueCategoriesId).length}/${res.taskItems.length}`,
        modifiedBy: res.modifiedBy,
        modifiedTime: new Date(res.modifiedTime)
      }
    ];

    // Detail: orderItems
    this.orderItems = res.taskItems.map(item => ({
      docNo: res.docNo,
      taskId: item.id,
      issueCategoriesName: item.issueCategoriesName,
      productName: item.productName,
      status: res.statusCode,
      actionBy: res.modifiedBy,
      actionTime: new Date(item.detectedTime ?? res.modifiedTime)
    }));

    // DevExtreme DataSources
    this.ordersDataSource = new DataSource({
      store: new ArrayStore({ key: 'docNo', data: this.orders })
    });

    this.orderItemsDataSource = new DataSource({
      store: new ArrayStore({ key: 'taskId', data: this.orderItems })
    });
  }

  getOrderItems(docNo: string) {
    return this.orderItems.filter(item => item.docNo === docNo);
  }

  getCategoriesCheckBox() {
    this.CheckBoxService.getCategoriesCheckBoxItem()
      .pipe(catchError(err => { this.options = []; return err; }))
      .subscribe((res: any) => {
        this.options = res;
        console.log('Categories CheckBox:', this.options);
      });
  }

  onOptionsChanged(updatedOptions: any[]) {
    console.log('Selected options:', updatedOptions.filter(o => o.selected));
  }

  onStatusOptionsChanged(updatedOptions: any[]) {
    console.log('Selected status:', updatedOptions.filter(o => o.selected));
  }

  navTo(path: string) {
    this.checkAccessService.CheckAccess(path).pipe(catchError(err => err))
      .subscribe((res: any) => {
        if (res.allowed) this.route.navigate([`/${path}`]);
        else this.route.navigate(['/landing']);
      });
  }

  onRejectViewPopupHide() {
    this.rejectPopupState = false;
  }

  onHistoryViewPopupHide() {
    this.historyPopupState = false;
  }
}

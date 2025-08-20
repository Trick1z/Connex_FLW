import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';
import { Router } from '@angular/router';
import { ViewsRoute } from 'src/app/constants/routes.const';
import { Action } from 'rxjs/internal/scheduler/Action';
import { CheckboxService } from 'src/app/services/checkbox.service';
import { CheckAccessService } from 'src/app/services/check-access.service';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {
  FieldDocNo: any;
  ProductName: string = "temp";

  ngOnInit(): void {
    this.getCategoriesCheckBox();
  }
  constructor(
    private categoriesDropDownService: DropDownService,
    private checkAccessService: CheckAccessService,
    private route: Router,
    private CheckBoxService: CheckboxService
  ) { }
  orders = [
    {
      docNo: 1, status: 'New', progressing: "2/5", modifiedBy: 1,

      modifiedTime: new Date('2023-10-01T10:00:00'),

    },
    {
      docNo: 2, status: 'In Progress', progressing: "2/6", modifiedBy: 2,
      modifiedTime: new Date('2023-10-02T11:00:00')
    },
    {
      docNo: 3, status: 'Completed', progressing: "5/6", modifiedBy: 3,
      modifiedTime: new Date('2023-10-03T12:00:00')
    }
  ];

  orderItems = [
    { docNo: 1, taskId: 1, issuecategoriesName: "borrow", productName: "Laptop", status: "create", ActionBy: 1, ActionTime: new Date('2023-10-01T10:00:00') },
    { docNo: 2, taskId: 2, issuecategoriesName: "repair", productName: "Phone", status: "create", ActionBy: 2, ActionTime: new Date('2023-10-02T11:00:00') },
    { docNo: 3, taskId: 3, issuecategoriesName: "IT", productName: "Mouse", status: "create", ActionBy: 3, ActionTime: new Date('2023-10-03T12:00:00') }
  ];

  

  options: any = [

  ]; rejectPopupState: boolean = false;
  historyPopupState: boolean = false;
  statusOptions = [
    { id: 1, text: 'New', selected: false },
    { id: 2, text: 'Process', selected: false }
  ];
  historyItem: any = [{ docNo: 1, action: "Reject", issueCategoriesName: "borrow", productName: "Laptop", status: "create", actionBy: 1, actionTime: new Date('2023-10-01T10:00:00') }] ;

  getOrderItems(docNo: number) {
    return this.orderItems.filter(item => item.docNo === docNo);
  }



  onRowClick(e: any) {
    // console.log('Row clicked:', e.data);
  }





  getCategoriesCheckBox() {
    return this.CheckBoxService.getCategoriesCheckBoxItem().pipe(catchError(err => {
      this.options = [];
      return err;
    })).subscribe((res: any) => {


      this.options = res

      console.log(this.options);

      // console.log(res);

    })
  }


  onOptionsChanged(updatedOptions: any[]) {
    // console.log('Selected options:', updatedOptions.filter(o => o.selected));
  }

  onStatusOptionsChanged(updatedOptions: any[]) {
    // console.log('Selected options:', updatedOptions.filter(o => o.selected));
  }

  navTo(path: string) {


    this.checkAccessService.CheckAccess(path).pipe(catchError(err => {

      return err;
    })).subscribe((res: any) => {
      // Handle onCheckAccess navigation
      console.log(res);

      if (res.allowed) {
        return this.route.navigate([`/${path}`]);
      }

      return this.route.navigate([ViewsRoute.LandingFullPath]);

    });
  }


  onRejectViewPopupHide() {

    this.rejectPopupState = false;
  }

  onHistoryViewPopupHide() {

    this.historyPopupState = false;
  }

}

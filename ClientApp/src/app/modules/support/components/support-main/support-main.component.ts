import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { CheckboxService } from 'src/app/services/checkbox.service';
import { TaskService } from '../../services/task.service';
import DataSource from 'devextreme/data/data_source';
import { Data } from '@angular/router';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam, JobForUserParam } from 'src/app/modules/admin/models/search.Model';
import Swal from 'sweetalert2';
import { USP_Query_FormTasksByStatusResult } from '../../models/assignedTask.model';

@Component({
  selector: 'app-support-main',
  templateUrl: './support-main.component.html',
  styleUrls: ['./support-main.component.scss']
})
export class SupportMainComponent implements OnInit {

  // =================== Variables ===================
  fieldDocNo: string | null = null;
  categoriesCheckBoxItem: any = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  unassignedTaskDataSource!: DataSource;
  assignedTaskDataSource!: DataSource;
  doneTaskDataSource!: DataSource;
  categoriesSearchId: string | null = null;
  borrowQuantity: number = 0;
  DonePopupVisible: boolean = false;
  prepareData: any;
  rejectPopupVisible: boolean = false;
  rejectDescriptions: string = "-"


  // =================== Constructor ===================
  constructor(
    private checkBoxService: CheckboxService,
    private taskService: TaskService
  ) { }

  // =================== Lifecycle ===================
  ngOnInit(): void {
    this.getTaskDataGrid()
    this.getCategoriesCheckBoxItem();
    // this.initUnassignedTaskDataSource()
  }

  // =================== Event Handlers ===================
  onCategoriesChanged(e: any) {
    const selectedItems = e
      .filter((item: any) => item.selected)
      .map((item: any) => item.value);

    this.categoriesSearchId = selectedItems.length > 0 ? selectedItems.join(',') : null;

    this.getTaskDataGrid();
  }

  onDocumentChange(e: any) {
    this.fieldDocNo = e

    this.getTaskDataGrid()

  }

  onStartDateChange(e: Date) {
    this.startDate = e
    this.getTaskDataGrid()

  }
  onEndDateChange(e: Date) {
    this.endDate = e
    this.getTaskDataGrid()

  }

  // =================== Load Checkbox Items ===================
  getCategoriesCheckBoxItem() {
    this.checkBoxService.getCategoriesCheckBoxItem()
      .pipe(catchError(err => {
        console.error('Error loading checkbox items:', err);
        return err;
      }))
      .subscribe((res: any) => {
        // console.log('Checkbox items loaded:', res);
        this.categoriesCheckBoxItem = res;
      });
  }

  getTaskDataGrid() {
    this.initUnassignedTaskDataSource()
    this.initAssignedTaskDataSource()
    this.initDoneTaskDataSource()
  }

  initUnassignedTaskDataSource() {
    this.unassignedTaskDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<JobForUserParam> = {
          searchCriteria: {
            status: "Draft", docNo: this.fieldDocNo, categories: this.categoriesSearchId
            , startDate: this.startDate, endDate: this.endDate
          },
          loadOption: loadOptions
        };
        return this.taskService.getUserTask(newLoad)
          .pipe(catchError(err => of(err)))
          .toPromise();
      }
    });
  }

  initAssignedTaskDataSource() {
    this.assignedTaskDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<JobForUserParam> = {
          searchCriteria: {
            status: "Assigned",
            docNo: this.fieldDocNo,
            categories: this.categoriesSearchId,
            startDate: this.startDate,
            endDate: this.endDate
          },
          loadOption: loadOptions
        };
        return this.taskService.getUserTask(newLoad)
          .pipe(catchError(err => of(err)))
          .toPromise();
      }
    });
  }
  initDoneTaskDataSource() {
    this.doneTaskDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<JobForUserParam> = {
          searchCriteria: {
            status: "Done", docNo: this.fieldDocNo, categories: this.categoriesSearchId
            , startDate: this.startDate, endDate: this.endDate
          },
          loadOption: loadOptions
        };
        return this.taskService.getUserTask(newLoad)
          .pipe(catchError(err => of(err)))
          .toPromise();
      }
    });
  }



  onDoneClicked(id: number) {
    const allData = this.assignedTaskDataSource.items()
    this.prepareData = allData.find(item => item.id === id);


    if (this.prepareData.issueCategoriesId == 1) {
      this.DonePopupVisible = true
      return
    }

  }

  onDonePopupHide() {
    this.prepareData = null;
    this.DonePopupVisible = false;
  }

  onDoneSubmit() {

    Swal.fire({
      title: 'Are you sure?',
      text: `ต้องการยืนยันส่งงาน `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {


        var newItem: USP_Query_FormTasksByStatusResult = this.prepareData
        this.taskService.taskManagement(newItem, "Done")
          .pipe(catchError(err => {
            return err
          })).subscribe((res => {

            Swal.fire({
              title: 'Done',
              text: 'Your Task Are Done',
              timer: 1500
            })
          }))


      };
    });
  }

  onSubmit(data: any, status: string, jobType: string | null = null) {
    if (status === 'CancelCompleted') {
      const allData = this.doneTaskDataSource.items()
      this.prepareData = allData.find(item => item.taskSeq === data.taskSeq && item.formId === data.formId);
    } else {
      if (jobType) {
        const allData = this.assignedTaskDataSource.items()
        this.prepareData = allData.find(item => item.taskSeq === data.taskSeq && item.formId === data.formId);
      }
      else {
        const allData = this.unassignedTaskDataSource.items()
        this.prepareData = allData.find(item => item.taskSeq === data.taskSeq && item.formId === data.formId);
      }
    }




    var title = "Are you sure?"
    Swal.fire({
      title: title,
      text: `Continue to the process`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {


        var newItem: USP_Query_FormTasksByStatusResult = this.prepareData

        if (status == "Rejected") {
          newItem.rejectReason = this.rejectDescriptions
        }
        this.taskService.taskManagement(newItem, status)
          .pipe(catchError(err => {
            return err
          })).subscribe((res => {

            this.getTaskDataGrid()

            Swal.fire({
              title: 'Done',
              text: 'You have completed the process',
              timer: 1500
            })
          }))
      };
    });
  }


  onRejectClicked(data: any) {
    this.rejectPopupVisible = true;
    this.prepareData = data

  }


  onSubmitReject() {
    var newItem: USP_Query_FormTasksByStatusResult = this.prepareData
    newItem.rejectReason = this.rejectDescriptions


    this.taskService.taskManagement(newItem, "Rejected").pipe(catchError(err => {


      return err
    })).subscribe((res => {


      this.getTaskDataGrid()
      Swal.fire({
        title: 'Rejected',
        text: 'Your Task Has Been Rejected',
        timer: 1500
      })

      this.onRejectPopupHide()
    }))

  }

  onRejectPopupHide() {
    this.prepareData = null
    this.rejectDescriptions = ''
    this.rejectPopupVisible = false;

  }
  test() {
    console.log("work");

  }
}

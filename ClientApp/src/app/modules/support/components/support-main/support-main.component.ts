import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { CheckboxService } from 'src/app/services/checkbox.service';
import { TaskService } from '../../services/task.service';
import DataSource from 'devextreme/data/data_source';
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
            status: "Submit", docNo: this.fieldDocNo, categories: this.categoriesSearchId
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

  private getPreparedData(data: any, status: string, jobType: string | null) {
    if (status === "CancelCompleted") {
      return this.doneTaskDataSource.items()
        .find(item => item.taskSeq === data.taskSeq && item.formId === data.formId);
    }

    if (jobType) {
      return this.assignedTaskDataSource.items()
        .find(item => item.taskSeq === data.taskSeq && item.formId === data.formId);
    }

    return this.unassignedTaskDataSource.items()
      .find(item => item.taskSeq === data.taskSeq && item.formId === data.formId);
  }


  async onSubmit(data: any, status: string, jobType: string | null = null, requiredCategoryId: number | null = null) {
    this.prepareData = this.getPreparedData(data, status, jobType);

    if (status === "Rejected") {

      const { value: reason } = await Swal.fire({
        title: "Enter reject reason",
        input: "textarea",
        inputPlaceholder: "Type your reason here...",
        inputValidator: (value) => {
          return null;
        },
        showCancelButton: true
      });

      // if (!reason) return;
      this.prepareData.rejectReason = reason;
    }

    if (status === "Done" && this.prepareData.issueCategoriesId == 1) {

      const { value: quantity } = await Swal.fire({
        title: "Enter borrow quantity",
        input: "number",
        inputPlaceholder: "Type borrow quantity here...",
        inputValue: this.prepareData.br_Qty,
        inputValidator: (quantity) => {
          if (parseInt(quantity) <= 0) return "This field can not be 0";
          return;
        },

        showCancelButton: true
      });

      this.prepareData.br_Qty = parseInt(quantity);
    }

    // Confirm การทำงาน
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Continue to the process",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (!result.isConfirmed) return;

    // เตรียมข้อมูลส่ง API
    const newItem: USP_Query_FormTasksByStatusResult = { ...this.prepareData };

    //  เรียก service
    this.taskService.taskManagement(newItem, status)
      .pipe(catchError(err => {


        Swal.fire({
          title: "Error",
          icon: "error",
          text: err?.error?.messages.update[0],
          timer: 1500,
          showConfirmButton: false
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);

        return err
      }))
      .subscribe(() => {
        this.getTaskDataGrid();

        Swal.fire({
          title: "Done",
          text: "You have completed the process",
          timer: 1500,
          showConfirmButton: false
        });
      });
  }

  onAllTaskClicked(status: string, IsAssigned: boolean | null = null) {
    // 
    Swal.fire({
      title: "Are you sure?",
      text: "Task All Task",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        var allTask!: Array<USP_Query_FormTasksByStatusResult>;

        if (IsAssigned) {
          allTask = this.assignedTaskDataSource.items()
        } else if (IsAssigned == null) {
          allTask = this.doneTaskDataSource.items().filter(item => item.canCancel);
        } else {
          allTask = this.unassignedTaskDataSource.items()
        }

        this.taskService.listTaskManagement(allTask, status).pipe(catchError(err => {

          console.log(err);
          
          Swal.fire({
            title: "Somthing when wrong",
            text: "Trying to reload in 1 second",
            icon: "success",
            timer: 1200
          });
          setTimeout(() => {
            window.location.reload();
          }, 1200);

          return err

        })).subscribe((res: any) => {
          this.getTaskDataGrid()
          return Swal.fire({
            title: "Done",
            text: "Your task are taken.",
            icon: "success",
            timer: 1200
          });
        })




      }
    });


  }
}

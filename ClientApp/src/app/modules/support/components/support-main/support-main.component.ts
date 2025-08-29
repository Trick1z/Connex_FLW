import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, of } from 'rxjs';
import { CheckboxService } from 'src/app/services/checkbox.service';
import { TaskService } from '../../services/task.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam, JobForUserParam } from 'src/app/modules/admin/models/search.Model';
import Swal from 'sweetalert2';
import { USP_Query_FormTasksByStatusResult } from '../../models/assignedTask.model';
import { DxDataGridComponent } from 'devextreme-angular';
import { Button, HeaderUnderline } from 'src/app/constants/color.const';

@Component({
  selector: 'app-support-main',
  templateUrl: './support-main.component.html',
  styleUrls: ['./support-main.component.scss']
})
export class SupportMainComponent implements OnInit {
  buttonColor = Button;
  underlineColor = HeaderUnderline;
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

  constructor(
    private checkBoxService: CheckboxService,
    private taskService: TaskService
  ) { }

  @ViewChild('unassignedGrid', { static: false }) unassignedGrid!: DxDataGridComponent;
  @ViewChild('assignedGrid', { static: false }) assignedGrid!: DxDataGridComponent;
  @ViewChild('doneGrid', { static: false }) doneGrid!: DxDataGridComponent;

  ngOnInit(): void {
    this.initSetUpDataSource();
  }

  initSetUpDataSource() {
    this.initUnassignedTaskDataSource();
    this.initAssignedTaskDataSource();
    this.initDoneTaskDataSource();
    this.initCategoriesCheckBox();
  }

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

  initCategoriesCheckBox() {
    this.checkBoxService.getCategoriesCheckBoxItem()
      .pipe(catchError(err => {
        return err;
      }))
      .subscribe((res: any) => {
        this.categoriesCheckBoxItem = res;
      });
  }

  getTaskDataGrid() {
    this.unassignedGrid.instance.refresh()
    this.assignedGrid.instance.refresh()
    this.doneGrid.instance.refresh()
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
      this.prepareData.rejectReason = reason;
    }

    if (status === "Done" && this.prepareData.issueCategoriesId == 1) {
      const { value: quantity } = await Swal.fire({
        title: "กรอกจำนวน",
        input: "number",
        inputPlaceholder: "กรูณาใส่จำนวน",
        inputValue: this.prepareData.br_Qty,
        inputValidator: (quantity) => {
          if (parseInt(quantity) <= 0) return "ใส่จำนวนให้ถูกต้อง";
          return;
        },
        showCancelButton: true
      });
      this.prepareData.br_Qty = parseInt(quantity);
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Continue to the process",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (!result.isConfirmed) return;

    const newItem: USP_Query_FormTasksByStatusResult = { ...this.prepareData };
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
}

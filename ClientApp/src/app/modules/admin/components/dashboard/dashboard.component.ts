import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam, OverallDetailParam, Search } from '../../models/search.Model';
import { catchError } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { QueryLogEnquiryParam } from 'src/app/modules/issue-inform/models/inform.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  overallPopupVisible: boolean = false;
  overallStatus: string = 'All';
  overallPopupHeader: string = 'Total Forms';
  searchUsernameValue: string = '';
  workLoadDataSource!: DataSource;
  overallDetailDataSource!: DataSource;
  overallFormStatusDataSource: any = {};
  logEnquiryDataSource!: DataSource;
  logEnquirySearchParam: QueryLogEnquiryParam = {
    docNo: null,
    formId: null,
    taskSeq: null,
    username: null,
    startDate: null,
    endDate: null
  }

  @ViewChild('workLoadGrid', { static: false }) public workLoadGrid!: DxDataGridComponent;
  @ViewChild('overallDetailGrid', { static: false }) public overallDetailGrid!: DxDataGridComponent;
  @ViewChild('logEnquiryGrid', { static: false }) public logEnquiryGrid!: DxDataGridComponent;

  constructor(
    private dashBoardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.initSetupDataSource()
  }

  initSetupDataSource() {
    this.initWorkLoad()
    this.initOverallFormStatus()
    this.initOverallDetail()
    this.initLogEnquiryDataSource()
  }

  onWorkloadEvent(e: string) { this.searchUsernameValue = e }
  onEnquiryDocNoEvent(e: string) { this.logEnquirySearchParam.docNo = e }
  onEnquiryUsernameEvent(e: string) { this.logEnquirySearchParam.username = e }
  onEnquiryFormIdEvent(e: any) { this.logEnquirySearchParam.formId = e }
  onEnquiryTaskSeqEvent(e: number) { this.logEnquirySearchParam.taskSeq = e }
  onEnquiryStartEvent(e: any) { this.logEnquirySearchParam.startDate = e.value }
  onEnquiryEndDateEvent(e: any) { this.logEnquirySearchParam.endDate = e.value }

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

  onWorkloadSearchClicked() { this.workLoadGrid.instance.refresh(); }

  initWorkLoad() {
    this.workLoadDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<Search> = {
          searchCriteria: { text: this.searchUsernameValue },
          loadOption: loadOptions
        };
        return this.dashBoardService.queryWorkLoad(newLoad)
          .pipe(catchError(err => {
            return err;
          })).toPromise();
      }
    });
  }

  initOverallFormStatus() {
    this.dashBoardService.queryOverallFormStatus()
      .pipe(
        catchError(err => {
          console.error(err);
          return [];
        })
      )
      .subscribe((res: any) => {
        this.overallFormStatusDataSource = res.data[0];
      });
  }

  onLogEnquirySearchClicked() { this.logEnquiryGrid.instance.refresh(); }

  onOverallPopupClicked(status: string, header: string) {
    this.overallPopupHeader = header
    this.overallStatus = status
    this.overallPopupVisible = true;
    this.overallDetailGrid.instance.refresh();
  }

  onOverallPopupHide() { this.overallPopupVisible = false; }

  initOverallDetail() {
    this.overallDetailDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<OverallDetailParam> = {
          searchCriteria: {
            docNo: null,
            status: this.overallStatus
          },
          loadOption: loadOptions
        };
        return this.dashBoardService.queryOverallFormStatusDetail(newLoad)
          .pipe(catchError(err => {
            return err;
          })).toPromise();
      }
    });
  }

  initLogEnquiryDataSource() {
    this.logEnquiryDataSource = new DataSource({
      load: (loadOptions: LoadOptions) => {
        const newLoad: DevExtremeParam<QueryLogEnquiryParam> = {
          searchCriteria: this.logEnquirySearchParam,
          loadOption: loadOptions
        };
        return this.dashBoardService.queryLogEnquiry(newLoad)
          .pipe(catchError(err => {
            return err;
          })).toPromise();
      }
    });
  }
}
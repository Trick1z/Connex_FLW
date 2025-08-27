import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data';
import { DevExtremeParam, Search } from '../../models/search.Model';
import { catchError } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  assignment: any = [

    {
      docNo: "YYMM001", issueCategoriesName: "borrow", productName: "mouse", qty: 2,
      location: "asd", timeToFound: "2023-10-01", img: "somebiew"
    }

  ]

  workLoadDataSource!: DataSource;
  searchUsernameValue: string = '';


  @ViewChild('workLoadGrid', { static: false }) public workLoadGrid!: DxDataGridComponent;


  ngOnInit(): void {
    this.initWorkLoad()
  }


  constructor(
    private dashBoardService: DashboardService
  ) { }

  onSearchBoxValueChange(e: any) {
    this.searchUsernameValue = e
    this.workLoadGrid.instance.refresh();
  }

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


}

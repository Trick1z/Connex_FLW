import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent {
  @Input() dataSource: any[] = [];
  @Input() columns: any[] = [];
  @Input() allowPaging: boolean = true;
  @Input() pageSize: number = 10;

  @Output() rowClicked = new EventEmitter<any>();

  onRowClick(event: any) {
    this.rowClicked.emit(event.data);
  }
}

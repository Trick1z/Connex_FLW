import { Component, Input } from '@angular/core';
import { WordList } from '../../models/game.model';

@Component({
  selector: 'app-grid-customer',
  templateUrl: './grid-customer.component.html',
  styleUrls: ['./grid-customer.component.scss']
})
export class GridCustomerComponent {
  @Input('dataList') public dataList: any;
  @Input('columnList') public columnList: any;
  @Input('ColumnAlignment') ColumnAlignment: 'left' | 'center' | 'right' = 'center';

calculateCellValue(data: any, column: any) {
  if (column.formatFunc) {
    return column.formatFunc(data[column.dataField]);
  }
  return data[column.dataField];
}



}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-grid-group',
  templateUrl: './data-grid-group.component.html',
  styleUrls: ['./data-grid-group.component.scss']
})
export class DataGridGroupComponent {
// ข้อมูลและ config columns
  @Input() dataSource: any[] = [];
  @Input() columns: { dataField: string; caption: string; editorType: string }[] = [];
  @Input() groups: { caption: string; columns: string[] }[] = [];

  // Event เมื่อ row ถูกแก้ไข
  @Output() rowUpdated = new EventEmitter<any>();

  onRowUpdating(e: any) {
    this.rowUpdated.emit(e);
  }

  getColumnCaption(field: string) {
    const col = this.columns.find(c => c.dataField === field);
    return col ? col.caption : field;
  }

  getEditorType(field: string) {
    const col = this.columns.find(c => c.dataField === field);
    return col ? col.editorType : 'textbox';
  }
}

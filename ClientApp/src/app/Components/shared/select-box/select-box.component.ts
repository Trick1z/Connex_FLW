import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelectBoxComponent {
@Input() items: any[] = [];            // รายการตัวเลือก
  @Input() value: any;                   // ค่าที่เลือก
  @Input() displayExpr: string = 'name'; // field สำหรับแสดง
  @Input() valueExpr: string = 'id';     // field สำหรับเก็บค่า
  @Input() placeholder: string = 'Select...';

  @Output() valueChange = new EventEmitter<any>();

  onValueChanged(e: any) {
    this.value = e.value;
    this.valueChange.emit(e.value);
  }
}

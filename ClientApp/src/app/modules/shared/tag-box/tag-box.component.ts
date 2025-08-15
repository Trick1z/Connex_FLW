import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag-box',
  templateUrl: './tag-box.component.html',
  styleUrls: ['./tag-box.component.scss']
})
export class TagBoxComponent {
 @Input() items: any[] = [];            // รายการตัวเลือก
  @Input() values: any[] = [];           // ค่าที่เลือก (array)
  @Input() displayExpr: string = 'name'; // field แสดง
  @Input() valueExpr: string = 'id';     // field เก็บค่า
  @Input() placeholder: string = 'Select items';

  @Output() valuesChange = new EventEmitter<any[]>();

  onValueChanged(e: any) {
    this.values = e.value;
    this.valuesChange.emit(e.value);
  }
}

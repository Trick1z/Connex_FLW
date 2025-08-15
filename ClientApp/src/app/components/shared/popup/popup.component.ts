import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

 @Input() title: string = 'Popup';       // ชื่อหัวข้อ Popup
  @Input() visible: boolean = false;      // กำหนดให้ Popup แสดงหรือไม่
  @Input() data: any = {};                // ข้อมูลที่จะส่งเข้า Popup

  @Output() close = new EventEmitter<void>();          // Event ปิด Popup
  @Output() save = new EventEmitter<any>();           // Event บันทึกข้อมูล

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.data);
  }

  objectKeys(obj: any): string[] {
  return obj ? Object.keys(obj) : [];
}



}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-panel',
  templateUrl: './error-panel.component.html',
  styleUrls: ['./error-panel.component.scss']
})
export class ErrorPanelComponent {
@Input() messages: string[] = [];   // ข้อความ error หลายข้อความ
  @Input() visible: boolean = false;  // กำหนดให้ panel แสดงหรือไม่

  @Output() close = new EventEmitter<void>(); // Event ปิด panel

  onClose() {
    this.close.emit();
  }
}

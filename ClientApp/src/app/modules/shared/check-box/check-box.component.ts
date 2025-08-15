import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent {
  @Input() value: boolean = false; // รับค่าจาก parent
  @Input() text: string = '';      // ข้อความ label
   @Input() options: { id: number, text: string, selected: boolean }[] = [];
  @Output() optionsChange = new EventEmitter<{ id: number, text: string, selected: boolean }[]>();

  onValueChanged(opt: any, e: any) {
    opt.selected = e.value;
    this.optionsChange.emit(this.options); // ส่งค่า updated กลับแม่
  }

}


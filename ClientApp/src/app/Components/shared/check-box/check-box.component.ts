import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent {
  @Input() value: boolean = false; // รับค่าจาก parent
  @Input() text: string = '';      // ข้อความ label

  @Output() valueChange = new EventEmitter<boolean>();

  onValueChanged(e: any) {
    this.value = e.value;
    this.valueChange.emit(e.value);
  }
}

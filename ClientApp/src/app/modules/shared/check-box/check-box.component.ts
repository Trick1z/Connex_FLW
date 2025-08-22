// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CheckboxList } from 'src/app/models/checkBox.model';

// @Component({
//   selector: 'app-check-box',
//   templateUrl: './check-box.component.html',
//   styleUrls: ['./check-box.component.scss']
// })
// export class CheckBoxComponent {
//   @Input() value: boolean = false; // รับค่าจาก parent
//   @Input() text: string = '';      // ข้อความ label
//    @Input() options: CheckboxList<any>[] = [];
//   @Output() optionsChange = new EventEmitter<{ id: number, text: string, selected: boolean }[]>();

//   onValueChanged(opt: any, e: any) {
//     opt.selected = e.value;
//     this.optionsChange.emit(this.options); // ส่งค่า updated กลับแม่
//   }

// }



import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxList } from 'src/app/models/checkBox.model';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent {
  @Input() value: boolean = false; // รับค่าจาก parent
  @Input() text: string = '';      // ข้อความ label
  @Input() options: CheckboxList<any>[] = [];  // แก้เป็น any แทน generic

  @Output() optionsChange = new EventEmitter<CheckboxList<any>[]>(); // emit เป็น CheckboxList[]

  onValueChanged(opt: CheckboxList<any>, e: any) {
    opt.selected = e.value;
    this.optionsChange.emit(this.options); // ส่งค่า updated กลับ parent
  }
}



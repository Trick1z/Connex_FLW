import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-number-box',
  templateUrl: './number-box.component.html',
  styleUrls: ['./number-box.component.scss']
})
export class NumberBoxComponent {

  @Input() value: number = 0;   // รับค่าจาก parent
  @Input() min: number = 0;     // ค่า min
  @Input() max: number = Infinity;   // ค่า max
  @Input() step: number = 1; 


    @Output('onValueChanged') public onValueChanged = new EventEmitter<number>();
  
    onValueChangeFunc(e: any) {      
      this.value = e.value
      this.onValueChanged.emit (this.value);
    }
    
}

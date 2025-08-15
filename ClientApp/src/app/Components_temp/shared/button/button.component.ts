import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input('message') public message: string = '';
  @Input() color: string = 'green'; // ค่าเริ่มต้นเป็นสีเขียว
  @Output('clicked') clicked = new EventEmitter<void>();


  onClick() {
    this.clicked.emit();
  }
}

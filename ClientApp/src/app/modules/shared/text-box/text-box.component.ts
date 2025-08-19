import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent {

  formData: any;
  @Input('value') public value: string  ="";
  @Input('placeHolder') public placeHolder: string = '...';

  @Output('onValueChanged') public onValueChanged = new EventEmitter<string>();

  onValueChangeFunc(e: any) {
    console.log(e);
    this.value = e.value

    this.onValueChanged.emit (this.value);

  }
}

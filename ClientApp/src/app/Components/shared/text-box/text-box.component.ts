import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent {

  formData:any ;
  @Input('value') public value: string = '';
  @Input('placeHolder') public placeHolder: string = '';
}

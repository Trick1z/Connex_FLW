import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent {

@Input('options') public options: any[] = [];
  colors = ['Red', 'Green', 'Blue'];
  selectedColor = 'Red';
  
  selectedOption = 2;
}

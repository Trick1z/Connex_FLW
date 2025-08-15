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
  // options = [
  //   { id: 1, name: 'Option A' },
  //   { id: 2, name: 'Option B' },
  //   { id: 3, name: 'Option C' }
  // ];



}

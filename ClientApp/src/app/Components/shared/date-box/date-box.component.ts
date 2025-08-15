import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-box',
  templateUrl: './date-box.component.html',
  styleUrls: ['./date-box.component.scss']
})
export class DateBoxComponent {
private _selectedDate!: Date;

  @Input()
  set selectedDate(value: string | number | Date) {
    if (value instanceof Date) {
      this._selectedDate = value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      this._selectedDate = new Date(value);
    } else {
      this._selectedDate = new Date(); // fallback
    }
  }
  get selectedDate(): Date {
    return this._selectedDate;
  }

  constructor() {
    this._selectedDate = new Date();
  }
}

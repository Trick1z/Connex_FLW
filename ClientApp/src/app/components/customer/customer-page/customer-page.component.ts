import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.scss']
})
export class CustomerPageComponent {
data = [
  { word: 'สวัสดี', score: 5, date: '2025-08-08' },
  { word: 'ขอบคุณ', score: 4, date: '2025-08-07' }
];

columns = [
  { dataField: 'word', caption: 'คำ', width: 200 },
  { dataField: 'score', caption: 'คะแนน', width: 80 },
  { dataField: 'date', caption: 'วันที่', width: 150 }
];}

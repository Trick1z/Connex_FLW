import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from '../../shared/popup/popup.component';

@Component({
  selector: 'app-customer-add-page',
  templateUrl: './customer-add-page.component.html',
  styleUrls: ['./customer-add-page.component.scss'],
})
export class CustomerAddPageComponent {
  dataList: Array<any> = [];
  textBoxData: any = {};

  columns = [
    { dataField: 'word', caption: 'คำ', width: 200 },
    { dataField: 'score', caption: 'คะแนน', width: 80 },
    { dataField: 'date', caption: 'วันที่', width: 150 },
  ];

  categoriesSelect = [
    { id: 1, name: 'borrow' },
    { id: 2, name: 'repair' },
    { id: 3, name: 'software' },
  ];
  softwareSelect = [
    { id: 1, name: 'excel' },
    { id: 2, name: 'word' },
    { id: 3, name: 'power point' },
  ];

  // popref

  // ViewChild Exam

  // @ViewChild('popupRef') popup!: PopupComponent;

  userData :any = {
  };

  // bit data

  userdata :any = {
    task : 'task1',
    category : 1,
    taskItem : "mouse"

  }

  // openPopup() {
  //   this.popup.show();
  // }

  // saveData() {
  //   console.log(this.userData);
  //   this.popup.hide();
  // }

  testLog() {
    console.log(this.userData);
  }
}

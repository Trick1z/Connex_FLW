import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  options = [
    { id: 1, name: 'Option A' },
    { id: 2, name: 'Option B' },
    { id: 3, name: 'Option C' }
  ];
  myDate: Date = new Date();           // ✅ ใช้ Date object
  username: string = '';
  number: number = 0;
Checkoptions = [
    { id: 1, text: 'Option A', selected: false },
    { id: 2, text: 'Option B', selected: true },
    { id: 3, text: 'Option C', selected: false },
  ];categoryId: number = 3;

  categories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'Sports' }
  ];

  selectedTags: number[] = [1, 3];

  tagOptions = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Vue' },
    { id: 4, name: 'Svelte' }
  ];
users = [
    { id: 1, username: 'Sorrajin', email: 'sorra@example.com' },
    { id: 2, username: 'Sarotchin', email: 'sarot@example.com' },
  ];dataSource = [
    { username: 'Sorrajin', age: 26, birthDate: '1999-01-01', isActive: true },
    { username: 'Sarotchin', age: 27, birthDate: '1998-05-05', isActive: false },
  ];

  columns = [
    { dataField: 'username', caption: 'Username', editorType: 'textbox' },
    { dataField: 'age', caption: 'Age', editorType: 'numberbox' },
    { dataField: 'birthDate', caption: 'Birth Date', editorType: 'datebox' },
    { dataField: 'isActive', caption: 'Active', editorType: 'checkbox' },
  ];

  groups = [
    { caption: 'Personal Info', columns: ['username', 'age', 'birthDate'] },
    { caption: 'Status', columns: ['isActive'] }
  ];
showPopup = false;
  popupData = { username: '', age: 0 };

  showError = false;
  errorMessages: string[] = [];
  onOptionsChanged(updatedOptions: any[]) {
    console.log('Selected options:', updatedOptions.filter(o => o.selected));
  }
  

  openPopup() {
    this.popupData = { username: 'Sorrajin', age: 26 }; 
    this.showPopup = true;
  }

  handleClose() {
    this.showPopup = false;
  }

  handleSave(data: any) {
    this.showPopup = false;
  }


  triggerError() {
    this.errorMessages = [
      'Username is required.',
      'Age must be greater than 18.',
      'Email format is invalid.'
    ];
    this.showError = true;
  }

  handleCloseError() {
    this.showError = false;
  }

}

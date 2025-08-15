import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // radio
  options = [
    { id: 1, name: 'Option A' },
    { id: 2, name: 'Option B' },
    { id: 3, name: 'Option C' }
  ];
  // datebox
  myDate: Date = new Date();           // ✅ ใช้ Date object
  // text
  username: string = '';
  // number
  number: number = 0;
  // check
  isActive: boolean = true;
  // select
  categoryId: number = 3;

  categories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'Sports' }
  ];

  // tag
  selectedTags: number[] = [1, 3];

  tagOptions = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Vue' },
    { id: 4, name: 'Svelte' }
  ];

  // fileupload 
  handleFiles(files: File[]) {
    console.log('Selected files:', files);

    // ตัวอย่าง: อ่านไฟล์แบบ local
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => console.log('File content:', reader.result);
      reader.readAsText(file);
    });







  }
  // grid

  users = [
    { id: 1, username: 'Sorrajin', email: 'sorra@example.com' },
    { id: 2, username: 'Sarotchin', email: 'sarot@example.com' },
  ];

  handleUserClick(user: any) {
    console.log('Selected User:', user);
  }


  // grid group
  dataSource = [
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

  // Method handle event จาก DataGrid
  onRowUpdated(e: any) {
    console.log('Row Updated:', e);
    // ใส่ logic update backend หรือ state
  }


  // popup
  showPopup = false;
  popupData = { username: '', age: 0 };

  openPopup() {
    this.popupData = { username: 'Sorrajin', age: 26 }; // ตัวอย่างข้อมูล
    this.showPopup = true;
  }

  handleClose() {
    this.showPopup = false;
  }

  handleSave(data: any) {
    console.log('Saved Data:', data);
    this.showPopup = false;
  }

  // error
  showError = false;
  errorMessages: string[] = [];

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

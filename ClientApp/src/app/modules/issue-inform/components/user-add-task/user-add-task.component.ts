import { Component } from '@angular/core';

@Component({
  selector: 'app-user-add-task',
  templateUrl: './user-add-task.component.html',
  styleUrls: ['./user-add-task.component.scss']
})
export class UserAddTaskComponent {

  task: any;

  dddInformPopupState: boolean = true;


  onInformViewPopupHide() {
    this.dddInformPopupState = false;
  }

  issueOptions = [
    { id: 1, text: 'Borrow', type: 'Borrow' },
    { id: 2, text: 'Repair', type: 'Repair' },
    { id: 3, text: 'Program', type: 'Program' }
  ];

  productOptions: any = []; // จะดึงจาก API ตาม Issue
  selectedIssue: any;
  selectedProduct: any;
  selectedIssueType: string | undefined = '';

  borrowQty: number = 0;
  location: string = '';
  timeToFound: Date = new Date();
  uploadedFile: any;

  onIssueChanged(issueId: number) {
    const issue = this.issueOptions.find(x => x.id === issueId);
    this.selectedIssueType = issue?.type;

    // load products for this issue (cascade)
    this.loadProducts(issueId);
  }

  loadProducts(issueId: number) {
    // call API /api/Dropdown/{issueId} => assign to productOptions
    this.productOptions = [
      { id: 1, text: 'Product 1' },
      { id: 2, text: 'Product 2' }
    ];
  }

  createIssue() {
    console.log({
      selectedIssue: this.selectedIssue,
      selectedProduct: this.selectedProduct,
      borrowQty: this.borrowQty,
      location: this.location,
      timeToFound: this.timeToFound,
      uploadedFile: this.uploadedFile
    });
    this.dddInformPopupState = false;
  }
}

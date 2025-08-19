import { Component, OnInit } from '@angular/core';
import { DropDownService } from '../../../../services/drop-down.service';
import { catchError, pipe } from 'rxjs';
import { InformTask } from '../../models/inform.model';

@Component({
  selector: 'app-user-add-task',
  templateUrl: './user-add-task.component.html',
  styleUrls: ['./user-add-task.component.scss']
})
export class UserAddTaskComponent implements OnInit {
  ngOnInit(): void {
    this.getCategoriesDropDownItems();
  }
  constructor(
    private dropDownService: DropDownService
  ) { }
  task: any;

  dddInformPopupState: boolean = true;




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
    console.log("asd", this.informTaskData);

    this.dddInformPopupState = false;

    this.informTaskData = {
      issueCategoriesId: this.selectedIssue,
      productId: this.selectedProduct,
      borrowQty: this.borrowQty,
      location: this.location,
      detectedTime: this.timeToFound
    };
  }


  informTaskData: InformTask = {
    issueCategoriesId: null,
    productId: null,
    borrowQty: null,
    location: null,
    detectedTime: null
  }

  clearInform() {

    this.informTaskData = {
      issueCategoriesId: null,
      productId: null,
      borrowQty: null,
      location: null,
      detectedTime: null
    }

    console.log(this.informTaskData);
  }
  onAddInformPopupClose() {
    // this.clearInform();

    this.dddInformPopupState = false;
  }


  categoryOptions: any = [];
  getCategoriesDropDownItems() {
    this.dropDownService.getCategoryDropDown().pipe(catchError(err => {
      this.categoryOptions = [];
      return err;
    })).subscribe(res => {
      console.log(res);

      this.categoryOptions = res;
    });
  }

  onCategoriesValueChange(e: number) {
    const selectedCategory = this.categoryOptions.find(
      (c: any) => c.issueCategoriesId === e
    );
    this.selectedIssueType = selectedCategory.issueCategoriesName;

    this.informTaskData.issueCategoriesId = e
    this.getProductMapByCategories(e);
  }




  getProductMapByCategories(id: number) {
    this.dropDownService.getProductMapByCategories(id).pipe(catchError(err => {
      this.productOptions = [];
      return err;
    })).subscribe(res => {
      console.log(res);
      this.productOptions = res;
    });
  }
}

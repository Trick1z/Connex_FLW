import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { CheckboxService } from 'src/app/services/checkbox.service';

@Component({
  selector: 'app-support-main',
  templateUrl: './support-main.component.html',
  styleUrls: ['./support-main.component.scss']
})
export class SupportMainComponent implements OnInit {

  // =================== Variables ===================
  FieldDocNo: string = '';
  categoriesCheckBoxItem: any = [];

  assignment: any = [
    {
      docNo: "YYMM001",
      issueCategoriesName: "borrow",
      productName: "mouse",
      qty: 2,
      location: "asd",
      timeToFound: "2023-10-01",
      img: "somebiew"
    }
  ];

  // =================== Constructor ===================
  constructor(private checkBoxService: CheckboxService) { }

  // =================== Lifecycle ===================
  ngOnInit(): void {
    this.getCategoriesCheckBoxItem();
  }

  // =================== Event Handlers ===================
  onOptionsChanged(e: any) {
    console.log(e);
  }

  // =================== Load Checkbox Items ===================
  getCategoriesCheckBoxItem() {
    this.checkBoxService.getCategoriesCheckBoxItem()
      .pipe(catchError(err => {
        console.error('Error loading checkbox items:', err);
        return err;
      }))
      .subscribe((res: any) => {
        console.log('Checkbox items loaded:', res);
        this.categoriesCheckBoxItem = res;
      });
  }

}

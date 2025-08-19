import { Component, OnInit } from '@angular/core';
import { catchError, pipe } from 'rxjs';
import { CheckboxService } from 'src/app/services/checkbox.service';

@Component({
  selector: 'app-support-main',
  templateUrl: './support-main.component.html',
  styleUrls: ['./support-main.component.scss']
})
export class SupportMainComponent implements OnInit {

  ngOnInit(): void {
    this.getCategoriesCheckBoxItem()
  }
  constructor(
    private checkBoxService: CheckboxService
  ){}
  FieldDocNo: string = '';
  categoriesCheckBoxItem: any = [];


  assignment: any  =[

    {docNo : "YYMM001" , issueCategoriesName : "borrow" , productName : "mouse",qty : 2,
      location : "asd", timeToFound : "2023-10-01" , img : "somebiew" 
     }

  ]

  onOptionsChanged(e: any) {
    // this.options = elog
    // ;

    console.log(e);
    
  }

  getCategoriesCheckBoxItem (){
    this.checkBoxService.getCategoriesCheckBoxItem().pipe(catchError(err => {

      return err
    })).subscribe((res: any) => {
      console.log(res);
      
      this.categoriesCheckBoxItem = res;
    }); 
  }




}

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  assignment: any  =[

    {docNo : "YYMM001" , issueCategoriesName : "borrow" , productName : "mouse",qty : 2,
      location : "asd", timeToFound : "2023-10-01" , img : "somebiew" 
     }

  ]
}

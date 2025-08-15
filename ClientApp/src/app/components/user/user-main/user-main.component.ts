import { Component } from '@angular/core';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent {

  orders = [
    { id: 1, customer: 'John Doe', total: 250 },
    { id: 2, customer: 'Jane Smith', total: 400 },
    { id: 3, customer: 'Mike Johnson', total: 150 }
  ];

  orderItems = [
    { orderId: 1, product: 'Laptop', qty: 1, price: 250 },
    { orderId: 2, product: 'Phone', qty: 2, price: 200 },
    { orderId: 3, product: 'Mouse', qty: 3, price: 50 }
  ];



  FieldDocNo: any;
  ProductName: string = "temp";
statusOptions = [
    { id: 1, text: 'New', selected: false },
    { id: 2, text: 'Process', selected: false }
  ];
  onRowClick(e: any) {
    console.log('Row clicked:', e.data);
  }

  getOrderItems(orderId: number) {
    return this.orderItems.filter(item => item.orderId === orderId);
  }

  options = [
    { id: 1, text: 'Borrow', selected: false },
    { id: 2, text: 'Repair', selected: false },
    { id: 3, text: 'IT', selected: false },
  ];

  onOptionsChanged(updatedOptions: any[]) {
    console.log('Selected options:', updatedOptions.filter(o => o.selected));
  }

  onStatusOptionsChanged(updatedOptions: any[]) {
    console.log('Selected options:', updatedOptions.filter(o => o.selected));
  }
}

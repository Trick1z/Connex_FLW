import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthRoute,
  ViewsRoute,
  GamesRoute,
  CustomerRoute,
} from 'src/app/Constants/routes.const';
import { CustomerPageComponent } from './customer-page/customer-page.component';
import { CustomerAddPageComponent } from './customer-add-page/customer-add-page.component';

const routes: Routes = [
  {
    path: CustomerRoute.CustomerForm,
    component: CustomerPageComponent,
  },
  {
    path: CustomerRoute.CustomerAddForm,
    component: CustomerAddPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}

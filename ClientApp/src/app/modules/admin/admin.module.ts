import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { MasterComponent } from './components/master/master.component';
import { MapUserCategoriesComponent } from './components/map-user-categories/map-user-categories.component';
import { AddCategoriesProductMainComponent } from './components/add-categories-product-main/add-categories-product-main.component';



@NgModule({
  declarations: [
    MasterComponent,
    MapUserCategoriesComponent,
    AddCategoriesProductMainComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportMainComponent } from './components/support-main/support-main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SupportMainComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModule
  ]
})
export class SupportModule { }

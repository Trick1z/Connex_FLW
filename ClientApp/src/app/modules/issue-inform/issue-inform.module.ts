import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueInformRoutingModule } from './issue-inform-routing.module';
import { UserMainComponent } from './components/user-main/user-main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UserMainComponent],
  imports: [
    CommonModule,
    IssueInformRoutingModule,
    SharedModule
  ]
})
export class IssueInformModule { }

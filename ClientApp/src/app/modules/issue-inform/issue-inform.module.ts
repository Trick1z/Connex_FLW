import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueInformRoutingModule } from './issue-inform-routing.module';
import { UserMainComponent } from './components/user-main/user-main.component';
import { SharedModule } from '../shared/shared.module';
import { UserAddTaskComponent } from './components/user-add-task/user-add-task.component';
import { DxDataGridModule, DxValidatorModule } from 'devextreme-angular';
import dxValidator from 'devextreme/ui/validator';


@NgModule({
  declarations: [
    UserMainComponent,
    UserAddTaskComponent],
  imports: [
    CommonModule,
    IssueInformRoutingModule,
    SharedModule,
    DxDataGridModule,
    DxValidatorModule
  ]
})
export class IssueInformModule { }

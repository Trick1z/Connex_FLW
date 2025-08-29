import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxChartModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxRadioGroupModule, DxSelectBoxModule, DxTagBoxModule, DxTextAreaModule, DxTextBoxModule } from 'devextreme-angular';
import { ButtonComponent } from './button/button.component';
import { CheckBoxComponent } from './check-box/check-box.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { DataGridGroupComponent } from './data-grid-group/data-grid-group.component';
import { DateBoxComponent } from './date-box/date-box.component';
import { ErrorPanelComponent } from './error-panel/error-panel.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { GridCustomerComponent } from './grid-customer/grid-customer.component';
import { HeadUnderlineComponent } from './head-underline/head-underline.component';
import { NumberBoxComponent } from './number-box/number-box.component';
import { PopupComponent } from './popup/popup.component';
import { RadioComponent } from './radio/radio.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { TagBoxComponent } from './tag-box/tag-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { FormsModule } from '@angular/forms';
import dxTextArea from 'devextreme/ui/text_area';
import { DxiSeriesModule, DxoValueAxisModule } from 'devextreme-angular/ui/nested';



@NgModule({
  declarations: [
    ButtonComponent,
    CheckBoxComponent,
    DataGridComponent,
    DataGridGroupComponent,
    DateBoxComponent,
    ErrorPanelComponent,
    FileUploadComponent,
    GridCustomerComponent,
    HeadUnderlineComponent,
    NumberBoxComponent,
    HeadUnderlineComponent,
    NumberBoxComponent,
    PopupComponent,
    RadioComponent,
    SelectBoxComponent,
    TagBoxComponent,
    TextBoxComponent,


  ],
  imports: [
    CommonModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxTagBoxModule,
    DxSelectBoxModule,
    DxRadioGroupModule,
    FormsModule,
    DxFormModule,
    DxTextAreaModule,
    DxChartModule,
    DxiSeriesModule,
    DxoValueAxisModule

  ],
  exports: [
    CommonModule,
    ButtonComponent,
    CheckBoxComponent,
    DataGridComponent,
    DataGridGroupComponent,
    DateBoxComponent,
    ErrorPanelComponent,
    FileUploadComponent,
    GridCustomerComponent,
    HeadUnderlineComponent,
    NumberBoxComponent,
    HeadUnderlineComponent,
    NumberBoxComponent,
    PopupComponent,
    RadioComponent,
    SelectBoxComponent,
    TagBoxComponent,
    TextBoxComponent,
    FormsModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxTagBoxModule,
    DxSelectBoxModule,
    DxRadioGroupModule,
    DxFormModule,
    DxTextAreaModule,
    DxChartModule,
    DxiSeriesModule,
    DxoValueAxisModule


  ]

})
export class SharedModule { }

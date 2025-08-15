import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './Components/Pages/register/register.component';
import { HomeComponent } from './Components/views/home/home.component';
import { WordScoringComponent } from './Components/games/word-scoring/word-scoring.component';
import { FormsModule } from '@angular/forms';
import dxDataGrid from 'devextreme/ui/data_grid';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxRadioGroupModule, DxSelectBoxModule, DxTagBoxModule, DxTemplateModule, DxTextBoxModule, DxToastModule } from 'devextreme-angular';
import { NavbarTopComponent } from './Components/navbar/navbar-top/navbar-top.component';
import { LandingComponent } from './Components/Pages/landing/landing.component';
import dxForm from 'devextreme/ui/form';
import { EditPopupComponent } from './Components/games/word-scoring/edit-popup/edit-popup.component';
import { GridCustomerComponent } from './Components/shared/grid-customer/grid-customer.component';
import { CustomerPageComponent } from './Components/customer/customer-page/customer-page.component';
import { ButtonComponent } from './Components/shared/button/button.component';
import { PopupComponent } from './Components/shared/popup/popup.component';
import { HeadUnderlineComponent } from './Components/shared/head-underline/head-underline.component';
import { TextBoxComponent } from './Components/shared/text-box/text-box.component';
import { CustomerAddPageComponent } from './Components/customer/customer-add-page/customer-add-page.component';
import { UserMainComponent } from './Components/user/user-main/user-main.component';
import { MasterComponent } from './Components/admin/master/master.component';
import dxTextBox from 'devextreme/ui/text_box';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddCategoriesProductMainComponent } from './Components/admin/add-category-product/add-categories-product-main/add-categories-product-main.component';
import dxCheckBox from 'devextreme/ui/check_box';
import { NgTemplateOutlet } from '@angular/common';
import { MapUserCategoriesComponent } from './Components/admin/map-user-categories/map-user-categories.component';
import { RadioComponent } from './Components/shared/radio/radio.component';
import dxRadioGroup from 'devextreme/ui/radio_group';
import { DateBoxComponent } from './Components/shared/date-box/date-box.component';
import dxDateBox from 'devextreme/ui/date_box';
import { NumberBoxComponent } from './Components/shared/number-box/number-box.component';
import { CheckBoxComponent } from './Components/shared/check-box/check-box.component';
import { SelectBoxComponent } from './Components/shared/select-box/select-box.component';
import { TagBoxComponent } from './Components/shared/tag-box/tag-box.component';
import { FileUploadComponent } from './Components/shared/file-upload/file-upload.component';
import { DataGridComponent } from './Components/shared/data-grid/data-grid.component';
import { DataGridGroupComponent } from './Components/shared/data-grid-group/data-grid-group.component';
import { ErrorPanelComponent } from './Components/shared/error-panel/error-panel.component';
import { AuthInterceptor } from './Services/auth.interceptor';
import { LoginComponent } from './Components/Pages/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    WordScoringComponent,
    NavbarTopComponent,
    LandingComponent,
    EditPopupComponent,
    GridCustomerComponent,
    CustomerPageComponent,
    ButtonComponent,
    PopupComponent,
    HeadUnderlineComponent,
    CustomerAddPageComponent,
    TextBoxComponent,
    UserMainComponent,
    MasterComponent,
    AddCategoriesProductMainComponent,
    MapUserCategoriesComponent,
    RadioComponent, DateBoxComponent, 
    NumberBoxComponent, CheckBoxComponent,
     SelectBoxComponent, TagBoxComponent,
      FileUploadComponent, DataGridComponent, 
      DataGridGroupComponent, ErrorPanelComponent,
    
  ],
  imports: [
    BrowserModule, FormsModule,
    DxSelectBoxModule, AppRoutingModule,
    DxDataGridModule, DxButtonModule,
    DxFormModule, DxPopupModule,
    DxDropDownBoxModule, DxTextBoxModule,
    DxTagBoxModule, HttpClientModule,
    DxCheckBoxModule, DxTemplateModule,
    DxToastModule, DxRadioGroupModule,
    DxDateBoxModule,DxNumberBoxModule,
    DxFileUploaderModule
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // 👈 เพิ่มบรรทัดนี้เข้าไป

})
export class AppModule { }

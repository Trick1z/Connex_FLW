import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoute } from 'src/app/constants/routes.const';
import { UserMainComponent } from './components/user-main/user-main.component';

const routes: Routes = [
  {
    path: UserRoute.UserForm,
    component: UserMainComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueInformRoutingModule { }


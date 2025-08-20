import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoute } from 'src/app/constants/routes.const';
import { UserMainComponent } from './components/user-main/user-main.component';
import { UserAddTaskComponent } from './components/user-add-task/user-add-task.component';

const routes: Routes = [
  {
    path: UserRoute.UserForm,
    component: UserMainComponent
  },
  
  {
    path: UserRoute.UserAddForm,
    component: UserAddTaskComponent
  },
  {
    path: UserRoute.UserEditForm+"/:id",
    component: UserAddTaskComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueInformRoutingModule { }


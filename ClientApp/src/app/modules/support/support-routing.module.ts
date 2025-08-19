import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportRoute } from 'src/app/constants/routes.const';
import { SupportMainComponent } from './components/support-main/support-main.component';

const routes: Routes = [

  {
    path: SupportRoute.SupportWork,
    component: SupportMainComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }

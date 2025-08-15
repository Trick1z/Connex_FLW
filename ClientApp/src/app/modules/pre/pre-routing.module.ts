import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoute } from 'src/app/constants/routes.const';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

   {
          path: AuthRoute.Login,
          component: LoginComponent,
      },

  //  {
  //         path: AuthRoute.Register,
  //         component: RegisterComponent,
  //     },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreRoutingModule { }

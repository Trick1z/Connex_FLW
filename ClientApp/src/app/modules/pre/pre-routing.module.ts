import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoute , ViewsRoute } from 'src/app/constants/routes.const';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from 'src/app/components/views/landing/landing.component';


const routes: Routes = [


      {
          path: AuthRoute.Login ,
          component: LoginComponent
      },
      {
          path: AuthRoute.Register ,
          component: RegisterComponent
      },
      {
          path: ViewsRoute.Landing ,
          component: LandingComponent
      },

      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreRoutingModule { }

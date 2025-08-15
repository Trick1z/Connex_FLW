import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthRoute, LandingRoute } from 'src/app/Constants/routes.const';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';

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
        path: LandingRoute.Landing ,
        component: LandingComponent
    },
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

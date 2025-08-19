import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  ViewsRoute, } from 'src/app/constants/routes.const';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';


const routes: Routes = [

    {
        path: ViewsRoute.Home,
        component: HomeComponent
    }

    ,
    {
        path: ViewsRoute.Landing,
        component: LandingComponent
    }

]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewsRoutingModule { }

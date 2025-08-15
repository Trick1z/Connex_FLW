import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoute, ViewsRoute,  } from 'src/app/Constants/routes.const';
import { HomeComponent } from './home/home.component';


const routes: Routes = [

    {
        path: ViewsRoute.Home ,
        component: HomeComponent}

]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewsRoutingModule { }

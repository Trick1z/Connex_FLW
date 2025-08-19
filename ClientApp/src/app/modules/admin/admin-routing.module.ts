

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRoute } from 'src/app/constants/routes.const';
import { AddCategoriesProductMainComponent } from './components/add-categories-product-main/add-categories-product-main.component';
import { MapUserCategoriesComponent } from './components/map-user-categories/map-user-categories.component';
import { MasterComponent } from './components/master/master.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [

    {
        path: AdminRoute.AdminForm,
        component: MasterComponent,
    },
    {
        path: AdminRoute.AdminAddCategories,
        component: AddCategoriesProductMainComponent,
    },
    {
        path: AdminRoute.AdminUserCategories,
        component: MapUserCategoriesComponent,
    },
    {
        path: AdminRoute.AdminDashboard,
        component: DashboardComponent,
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoute, ViewsRoute, GamesRoute, UserRoute} from 'src/app/Constants/routes.const';
import { UserMainComponent } from './user-main/user-main.component';


const routes: Routes = [

    {
        path: UserRoute.UserForm ,
        component: UserMainComponent}

]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }

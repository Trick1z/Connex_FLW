import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRoute, AuthRoute, CustomerRoute, GamesRoute, UserRoute, ViewsRoute } from './constants/routes.const';
import { RedirectGuard } from './guards/redirect.guard';

const routes: Routes = [

  {

    path: '',
    children: [
      {
        path: AuthRoute.prefix,
        loadChildren: () => import('./modules/pre/pre.module').then(m => m.PreModule)

        // , canActivate: [NoAuthGuard],
      },
      {
        // canActivate: [AuthGuard],
        path: ViewsRoute.prefix,
        loadChildren: () => import('./components/views/views-routing.module').then(m => m.ViewsRoutingModule)
      },
      {
        // canActivate: [AuthGuard],
        path: UserRoute.prefix,
        loadChildren: () => import('./modules/issue-inform/issue-inform.module').then(m => m.IssueInformModule)
      },
      {
        // canActivate: [AuthGuard],
        path: AdminRoute.prefix,
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      } ,

      // เอาออก แม่
      // {
      //   // canActivate: [AuthGuard],
      //   path: LandingRoute.prefix,
      //   loadChildren: () => import('./modules/pre/pre.module').then(m => m.PreModule   )  }
    ]


  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

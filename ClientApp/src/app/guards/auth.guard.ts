


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthRoute ,ViewsRoute} from '../constants/routes.const';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckAccessService } from '../services/check-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private accessService : CheckAccessService
  ) {}


canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate([AuthRoute.LoginFullPath]);
      return of(false);
    }

    const pageUrl = state.url;

    return this.accessService.CheckAccess(pageUrl).pipe(
      map((res: any) => {
        if (!res.allowed) {
          this.router.navigate([ViewsRoute.LandingFullPath]);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate([AuthRoute.LoginFullPath]);
        return of(false);
      })
    );
  }

}



import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthRoute ,ViewsRoute} from '../constants/routes.const';
import { ApiService } from '../services/api-service.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private api: ApiService
  ) {}


canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate([AuthRoute.LoginFullPath]);
      return of(false);
    }

    const pageUrl = state.url;

    return this.api.post('api/Authentication/check-access', { pageUrl }).pipe(
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
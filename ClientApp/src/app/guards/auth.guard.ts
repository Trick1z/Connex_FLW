import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthRoute, ViewsRoute } from '../constants/routes.const';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckAccessService } from '../services/check-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate , CanActivateChild {

  constructor(
    private router: Router,
    private accessService: CheckAccessService
  ) {}


  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('เข้า vc');
    
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('เข้า');
    
    
    const token = localStorage.getItem('token');

    // ถ้าไม่มี token ให้ redirect ไปหน้า login
    if (!token) {
      this.router.navigate([AuthRoute.LoginFullPath]);
      return of(false);
    }

    const pageUrl = state.url;

    // ตรวจสอบสิทธิ์จาก backend
    return this.accessService.CheckAccess(pageUrl).pipe(
      map((res: any) => {
        if (res.allowed) {
          return true; // ถ้ามีสิทธิ์ ให้เข้าหน้านี้
        } else {
          this.router.navigate([ViewsRoute.LandingFullPath]); // ไม่มีสิทธิ์ redirect ไป landing
          return false;
        }
      }),
      catchError((err) => {
        console.error('AuthGuard Error:', err);
        this.router.navigate([AuthRoute.LoginFullPath]); // error ให้กลับไป login
        return of(false);
      })
    );
  }
}

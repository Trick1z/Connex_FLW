// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {

  
//   return true;
// };



import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthRoute, LandingRoute } from '../Constants/routes.const';
import { AuthServiceService } from '../Services/auth-service.service';
import { ApiService } from '../Services/api-service.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // constructor(private router: Router) {}

  // canActivate(): boolean {
  //   const token = sessionStorage.getItem('token');

  //   if (token) {
  //     return true;
  //   } else {
  //     this.router.navigate([AuthRoute.LoginFullPath]);
  //     return false;
  //   }
  // }

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private api: ApiService
  ) {}


canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate([AuthRoute.Login]);
      return of(false);
    }

    const pageUrl = state.url;

    return this.api.post('api/User/check-access', { pageUrl }).pipe(
      map((res: any) => {
        if (!res.allowed) {
          this.router.navigate([LandingRoute.Landing]);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate([AuthRoute.Login]);
        return of(false);
      })
    );
  }



  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> {

  //   const token = this.authService.getToken();
  //   const page = state.url; // route ที่ผู้ใช้จะเข้า

  //   if (!token) {
  //     this.router.navigate(['/login']);
  //     return of(false);
  //   }

  //   // ส่ง JWT + Page ไป backend ตรวจสอบ
  //   return this.apiService.post('auth/check-access', { token, page }).pipe(
  //     map((res: any) => {
  //       if (res.allowed) {
  //         return true; // ให้เข้าหน้าเพจ
  //       } else {
  //         this.router.navigate(['/unauthorized']); // หรือ redirect หน้าอื่น
  //         return false;
  //       }
  //     }),
  //     catchError(() => {
  //       this.router.navigate(['/login']);
  //       return of(false);
  //     })
  //   );
  // }
}
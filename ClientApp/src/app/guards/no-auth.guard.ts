// import { CanActivateFn } from '@angular/router';

// export const noAuthGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ViewsRoute } from '../Constants/routes.const';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return true; // ยังไม่ login เข้าได้
    }
    this.router.navigate([ViewsRoute.HomeFullPath]); // logged in แล้ว redirect ออก
    return false;
  }
}

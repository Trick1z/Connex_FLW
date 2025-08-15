// import { CanActivateFn } from '@angular/router';

// export const redirectGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthRoute } from '../Constants/routes.const';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
  const token = sessionStorage.getItem('token');
  // console.log('RedirectGuard: token=', token);

  return new Promise(resolve => {
    setTimeout(() => {
      if (token) {
        this.router.navigate([AuthRoute.RegisterFullPath])
      } else {
        this.router.navigate([AuthRoute.LoginFullPath]);
      }
      resolve(false);
    }, 0);
  });
}

}

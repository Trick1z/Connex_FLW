import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ViewsRoute } from '../constants/routes.const';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    // ถ้าไม่มี token => ยังไม่ login ให้เข้าหน้าได้
    if (!token) {
      return true;
    }

    // ถ้า logged in แล้ว => redirect ไป home
    this.router.navigate([ViewsRoute.HomeFullPath]);
    return false;
  }
}

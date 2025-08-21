
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ViewsRoute } from '../constants/routes.const';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true; // ยังไม่ login เข้าได้
    }
    this.router.navigate([ViewsRoute.HomeFullPath]); // logged in แล้ว redirect ออก
    return false;
  }
}

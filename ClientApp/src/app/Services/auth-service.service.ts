import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api-service.service';
import { Router } from '@angular/router';
import { AuthRoute } from '../Constants/routes.const';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  //   constructor(private api: ApiService) { }


  //  login(credentials: { username: string, password: string }): Observable<any> {
  //     return this.api.post('api/User/login', credentials).pipe(
  //       tap((res: any) => {
  //         if (res && res.token) {
  //           localStorage.setItem('token', res.token);
  //           localStorage.setItem('roleId', res.roleId);
  //           localStorage.setItem('accessPages', JSON.stringify(res.accessPages));
  //         }
  //       })
  //     );
  //   }



  // getToken(): string | null {
  //     return localStorage.getItem('token');
  //   }

  //   getRole(): number | null {
  //     const role = localStorage.getItem('roleId');
  //     return role ? +role : null;
  //   }

  //   getAccessPages(): string[] {
  //     const pages = localStorage.getItem('accessPages');
  //     return pages ? JSON.parse(pages) : [];
  //   }

  //   logout() {
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('roleId');
  //     localStorage.removeItem('accessPages');
  //   }

  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'roleId';
  private readonly ACCESS_PAGES_KEY = 'accessPages';

  constructor(private api: ApiService, private router: Router) { }

  // Login: เก็บ token, roleId, accessPages ลง localStorage
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.api.post('api/User/login', credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.setToken(res.token);
          this.setRole(res.roleId);
          this.setAccessPages(res.accessPages);
        }
      })
    );
  }

  // Logout: ล้างข้อมูลและกลับไปหน้า login
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.ACCESS_PAGES_KEY);
    this.router.navigate([AuthRoute.LoginFullPath]);
  }

  // Getters
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): number | null {
    const role = localStorage.getItem(this.ROLE_KEY);
    return role ? +role : null;
  }

  getAccessPages(): string[] {
    const pages = localStorage.getItem(this.ACCESS_PAGES_KEY);
    return pages ? JSON.parse(pages) : [];
  }

  // Setters (private)
  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRole(roleId: number) {
    localStorage.setItem(this.ROLE_KEY, roleId.toString());
  }

  private setAccessPages(pages: string[]) {
    localStorage.setItem(this.ACCESS_PAGES_KEY, JSON.stringify(pages));
  }

  // Check if user has access to a page
  hasAccess(pageUrl: string): boolean {
    const pages = this.getAccessPages();
    return pages.includes(pageUrl);
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }


}
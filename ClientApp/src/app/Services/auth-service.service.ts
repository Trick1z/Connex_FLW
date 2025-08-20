import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRoute } from '../constants/routes.const';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'roleId';
  private readonly ACCESS_PAGES_KEY = 'accessPages';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post('api/Authentication/login', credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.setToken(res.token);
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
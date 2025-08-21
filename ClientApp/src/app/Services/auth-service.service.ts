import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRoute } from '../constants/routes.const';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  // =================== LocalStorage Keys ===================
  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'roleId';
  private readonly ACCESS_PAGES_KEY = 'accessPages';

  // =================== Constructor ===================
  constructor(private http: HttpClient, private router: Router) { }

  // =================== Authentication ===================
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}Authentication/login`, credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.setToken(res.token);
          // Optional: สามารถ setRole/res.accessPages ได้ถ้ามีจาก backend
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.ACCESS_PAGES_KEY);
    this.router.navigate([AuthRoute.LoginFullPath]);
  }

  // =================== Getters ===================
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

  // =================== Setters (Private) ===================
  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRole(roleId: number) {
    localStorage.setItem(this.ROLE_KEY, roleId.toString());
  }

  private setAccessPages(pages: string[]) {
    localStorage.setItem(this.ACCESS_PAGES_KEY, JSON.stringify(pages));
  }

  // =================== Authorization ===================
  hasAccess(pageUrl: string): boolean {
    const pages = this.getAccessPages();
    return pages.includes(pageUrl);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

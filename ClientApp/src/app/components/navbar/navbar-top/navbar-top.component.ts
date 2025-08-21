import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AdminRoute, AuthRoute, SupportRoute, UserRoute, ViewsRoute } from 'src/app/constants/routes.const';
import { CheckAccessService } from '../../../services/check-access.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.scss']
})
export class NavbarTopComponent implements OnInit {

  // User
  username: string = 'Unknown User';

  // Routes
  adminRoutes = [
    { name: AdminRoute.AdminFormName, path: AdminRoute.AdminFormFullPath },
    { name: AdminRoute.AdminAddCategoriesName, path: AdminRoute.AdminAddCategoriesFullPath },
    { name: AdminRoute.AdminUserCategoriesName, path: AdminRoute.AdminUserCategoriesFullPath },
    { name: AdminRoute.AdminDashboardName, path: AdminRoute.AdminDashboardFullPath }
  ];

  userRoutes = [
    { name: UserRoute.UserFormName, path: UserRoute.UserFormFullPath },
    { name: UserRoute.UserAddForm, path: UserRoute.UserAddFormFullPath }
  ];

  supportRoutes = [
    { name: SupportRoute.SupportWork, path: SupportRoute.SupportWorkFullPath }
  ];

  // Dropdown states
  isAdminDropdownOpen: boolean = false;
  isUserDropdownOpen: boolean = false;
  isSupportDropdownOpen: boolean = false;

  // Output events
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(
    private router: Router,
    private checkAccessService: CheckAccessService
  ) {}

  ngOnInit(): void {
    this.loadUsername();
  }

  // Load user from session
  private loadUsername(): void {
    const data = sessionStorage.getItem('user');
    if (data) {
      const parsed = JSON.parse(data);
      this.username = parsed.user?.username || 'Unknown User';
    }
  }

  // Dropdown toggles
  toggleAdminDropdown(): void {
    this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  toggleSupportDropdown(): void {
    this.isSupportDropdownOpen = !this.isSupportDropdownOpen;
  }

  closeAllDropdowns(): void {
    this.isAdminDropdownOpen = false;
    this.isUserDropdownOpen = false;
    this.isSupportDropdownOpen = false;
  }

  // Navigation with access check
  navigateTo(path: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate([AuthRoute.Login]);
      return;
    }

    this.checkAccessService.CheckAccess(`/${path}`)
      .pipe(
        catchError(err => {
          this.router.navigate([ViewsRoute.LandingFullPath]);
          return of(null);
        })
      )
      .subscribe((res  :any) => {
        if (res?.allowed) {
          this.router.navigate([path]);
        } else {
          this.router.navigate([ViewsRoute.LandingFullPath]);
        }
      });
  }

  // Logout
  onLogout(): void {
    sessionStorage.clear();
    this.logoutEvent.emit();
    this.router.navigate([AuthRoute.LoginFullPath]);
  }

}

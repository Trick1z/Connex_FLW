import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { AdminRoute, AuthRoute } from 'src/app/Constants/routes.const';

import { AdminRoute, AuthRoute, SupportRoute, UserRoute, ViewsRoute } from 'src/app/constants/routes.const';
import { ApiService } from 'src/app/services/api-service.service';
import { CheckAccessService } from '../../../services/check-access.service';
import { catchError } from 'rxjs';



@Component({
  selector: 'app-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.scss']
})
export class NavbarTopComponent {
  Username: string = 'Unknown User';

  // AdminRoute :Array<string> = [AdminRoute.AdminFormFullPath , AdminRoute.AdminAddCategoriesFullPath]; 

  adminRoutes: any = [
    {
      name: AdminRoute.AdminFormName,
      path: AdminRoute.AdminFormFullPath
    },
    {
      name: AdminRoute.AdminAddCategoriesName,
      path: AdminRoute.AdminAddCategoriesFullPath
    },
    {
      name: AdminRoute.AdminUserCategoriesName,
      path: AdminRoute.AdminUserCategoriesFullPath
    },
    {
      name: AdminRoute.AdminDashboardName,
      path: AdminRoute.AdminDashboardFullPath
    }
  ]
  userRoutes: any = [
    {
      name: UserRoute.UserFormName,
      path: UserRoute.UserFormFullPath
    },
    {
      name: UserRoute.UserAddForm,
      path: UserRoute.UserAddFormFullPath
    },
  ]


  supportRoutes: any = [
    {
      name: SupportRoute.SupportWork,
      path: SupportRoute.SupportWorkFullPath
    },
    
  ]

  // dropdown state
  adminDropdownOpen = false;
  userDropdownOpen = false;
  supportDropdownOpen = false;

  ngOnInit(): void {
    this.setUser();
  }
  constructor(private route: Router,
    private checkAccessService: CheckAccessService
  ) { }

  setUser() {
    const data = sessionStorage.getItem('user');

    if (data !== null) {
      const parsed = JSON.parse(data);
      // this.Username = parsed.
      this.Username = parsed.user.username;
    } else {
      // กรณี data เป็น null (เช่น ไม่มี key ใน sessionStorage)
    }
  }


  // set dropdown f
  adminToggleDropdown() {
    this.adminDropdownOpen = !this.adminDropdownOpen;
  }
  userToggleDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  SupportToggleDropdown() {
    this.supportDropdownOpen = !this.supportDropdownOpen;
  }

  CloseDropdown() {
    this.adminDropdownOpen = false;
    this.userDropdownOpen = false;
  }


  navigateTo(path: string) {

    console.log(path);
    

    const token = localStorage.getItem('token');
    if (!token) {
      this.route.navigate([AuthRoute.Login]);
      return;
    }

    // เรียก backend ตรวจสอบสิทธิ์
    this.checkAccessService.onCheckAccess(path).pipe(catchError(err => {
      this.route.navigate([ViewsRoute.LandingFullPath]);

      return err
    })).subscribe((res: any) => {
      if (res.allowed) {

        console.log("true");
        
        this.route.navigate([path]);

      } else {
        this.route.navigate([ViewsRoute.LandingFullPath]);    }
    },)
  }


  onLogout() {
    sessionStorage.clear();
    return this.route.navigate([AuthRoute.LoginFullPath]);
  }
}

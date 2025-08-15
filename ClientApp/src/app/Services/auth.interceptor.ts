// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     return next.handle(request);
//   }
// }


import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';
import { NotificationService } from './notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthServiceService,
    private notify: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1️⃣ Clone request และเพิ่ม JWT Header ถ้ามี
    const token = this.authService.getToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // 2️⃣ ส่ง request ต่อไป และจับ response / error
    return next.handle(authReq).pipe(
      tap(event => {
        // 3️⃣ สามารถเพิ่ม logging ถ้าต้องการ
        // console.log('HTTP Event:', event);
      }),
      catchError((error: HttpErrorResponse) => {
        // 4️⃣ Handle Error
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          // Client side error
          errorMsg = `Client Error: ${error.error.message}`;
        } else {
          // Server side error
          errorMsg = `Server Error: ${error.status} - ${error.message}`;
        }

        // 5️⃣ แสดง notification popup
        this.notify.showError(errorMsg);

        // 6️⃣ ถ้า 401 ให้ logout
        if (error.status === 401) {
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }
}

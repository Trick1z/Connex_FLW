import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRoute, ViewsRoute } from 'src/app/constants/routes.const';
import { ApiService } from 'src/app/services/api-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserData } from '../../models/login.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthServiceService

  ) { }

  passwordMode: string = "password";
  userData: UserData = {
    username: "",
    password: ""
  }

  usernameError: string[] = [];
  showError: boolean = false
  handleCloseError() {
    this.showError = false;
  }
  triggerError() {

    this.showError = true;
  }


  NavigateToRegisterPage() {

    return this.router.navigate([AuthRoute.RegisterFullPath])
  }

  //   onSubmit() {
  //    this.api.post('api/User/login',this.userData ).subscribe((res :any) =>{
  //     console.log(res); 
  //    })
  //   }

  onSubmit() {
    this.authService.login(this.userData).subscribe({
      next: () => {

        Swal.fire({
          title: 'สำเร็จ',
          text: 'เข้าสู่ระบบสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1500,
        });

        // console.log('next work');


        this.router.navigate([ViewsRoute.HomeFullPath]);

      },
      error: (err) => {
        // console.log(err);
        this.usernameError = []
        if (err.error && err.error.messages) {
          Object.keys(err.error.messages).forEach((key) => {
            const val = err.error.messages[key];
            if (Array.isArray(val)) {
              this.usernameError.push(...val); // push array ทั้งหมด
            } else {
              this.usernameError.push(val);    // push string เดียว
            }
          });
        }
      }
    });




  }
}


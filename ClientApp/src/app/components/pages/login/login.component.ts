import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRoute, ViewsRoute } from 'src/app/constants/routes.const';
import Swal from 'sweetalert2';
import { UserData } from '../../models/auth.model';
import { ApiService } from 'src/app/services/api-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

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
  showError : boolean = false
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
        console.log('next work');

        this.usernameError = []
        this.router.navigate([ViewsRoute.HomeFullPath]);

      },
      error: (err) => {
        // console.log(err);

        if (err.error && err.error.messages) {
          // this.usernameError = err.error.messages.username || '';
          // // this.usernameError.push(err.error.messages.username || '') ;
          //       alert(err.error.messages.username.system[0])

          // alert(err.error.messages.system)

          this.usernameError.push(err.error.messages.system)


        }
      }
    });




  }
}


import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api-service.service';
import { RegisterData, Role } from '../../models/register.model';
import { AuthRoute } from 'src/app/constants/routes.const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
    this.getRoleItem();
  }
  constructor(private api: ApiService,
    private navigator: Router
  ) { }
  customerRole: Role[] = [

  ];
  registerData: RegisterData = {

    username: "",
    password: "",
    confirmPassword: "",
    role: 0
  }

  error: string[] = [];

  onSubmit(event: Event) {
    this.error = [];


    event.preventDefault(); // กัน reload + กัน interceptor ยิง request แปลก ๆ
    this.api.post("api/Authentication/register", this.registerData).subscribe({
      next: (res: any) => {

        Swal.fire({
          title: 'สำเร็จ',      
          text: 'ลงทะเบียนสำเร็จ',
          icon: 'success',  
          confirmButtonText: 'ตกลง'
        })
        
        // console.log("✅ success:", res);
        this.navigator.navigate([AuthRoute.LoginFullPath]);
      },
      error: (err: any) => {
        // if (err.error && err.error.messages) {
        //   this.error.push(err.error.messages.username)
        // }
        this.error = [];
        if (err.error && err.error.messages) {
          Object.keys(err.error.messages).forEach((key) => {
            const val = err.error.messages[key];
            if (Array.isArray(val)) {
              this.error.push(...val); // push array ทั้งหมด
            } else {
              this.error.push(val);    // push string เดียว
            }
          });
        }
      }
    });

  }

  getRoleItem() {
    this.api.get("api/DropDown/role").subscribe((res: any) => {

      this.customerRole = res
      // console.log(res);

    })
  }

  NavigateToLoginPage(){
    this.navigator.navigate([AuthRoute.LoginFullPath]);
  }

}

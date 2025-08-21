import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RegisterData, Role } from '../../models/register.model';
import { AuthRoute } from 'src/app/constants/routes.const';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { catchError } from 'rxjs';
import { DropDownService } from 'src/app/services/drop-down.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // =================== Variables ===================
  customerRole: Role[] = [];
  
  registerData: RegisterData = {
    username: "",
    password: "",
    confirmPassword: "",
    role: 0
  };

  error: string[] = [];

  // =================== Constructor ===================
  constructor(
    private navigator: Router,
    private registerService: RegisterService,
    private dropDownService: DropDownService
  ) { }

  // =================== Lifecycle ===================
  ngOnInit(): void {
    this.getRoleItem();
  }

  // =================== Form Submission ===================
  onSubmit(event: Event) {
    event.preventDefault(); // ป้องกัน reload page
    this.error = [];

    this.registerService.onRegisterSubmit(this.registerData)
      .pipe(catchError(err => {
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
        return err;
      }))
      .subscribe((res: any) => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'ลงทะเบียนสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
        this.navigator.navigate([AuthRoute.LoginFullPath]);
      });
  }

  // =================== Load Role Items ===================
  getRoleItem() {
    this.dropDownService.getRoleDropDownItem()
      .pipe(catchError(err => { return err; }))
      .subscribe((res: any) => {
        this.customerRole = res;
      });
  }

  // =================== Navigation ===================
  NavigateToLoginPage() {
    this.navigator.navigate([AuthRoute.LoginFullPath]);
  }

}

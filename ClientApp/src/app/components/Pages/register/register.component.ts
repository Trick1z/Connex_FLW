import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RegisterData } from '../../models/auth.model';
import { ApiService } from '../../../Services/api-service.service';
import { Role } from '../login/models/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
ngOnInit(): void {
  this.getRoleItem();
}
  constructor(private api :ApiService){}
  customerRole : Role[] = [

  ];
  registerData: RegisterData = {

    username: "",
    password: "",
    confirmPassword: "", 
    role: 0
  }

  onSubmit() {


    

    // 1 จำเป็นต้อง validate ตรงหน้าบ้านมั้ย 
    if (!this.registerData.username?.trim() ||
      !this.registerData.password?.trim() ||
      !this.registerData.confirmPassword?.trim() ||
      this.registerData.role == 0) {

      return Swal.fire({
        title: "กรุณาใส่ข้อมูลให้ครบถ้วน",
        icon: "error",
        draggable: true
      });


    }

// register apth : /api/User/register
    // this.api.post

    // if (this.registerData.password !== this.registerData.confirmPassword) {
    //   return Swal.fire({
    //     title: "รหัสผ่านไม่ตรงกัน",
    //     icon: "error",
    //     draggable: true
    //   });
    // }


    // true
    return 
    // return console.log(this.registerData);
  }

  getRoleItem(){
    this.api.get("api/DropDown/role").subscribe((res : any ) =>{

      this.customerRole = res
      // console.log(res);
      
    })
  }
}

import { Injectable } from '@angular/core';
import { Alert } from 'src/app/constants/alert.const';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  showSuccessPopup(msg: string, delay: number = 2000) {
    return Swal.fire({
      title: Alert.successTitle,
      text: msg,
      icon: 'success',
      showConfirmButton: false,
      timer: delay
    });
  }

  showErrorLog(err: any, delay: number = 2000) {
    Swal.fire({
      title: Alert.errorTitle,
      text:
        err?.error?.messages?.username
        || err?.error?.messages?.password
        || err?.error?.messages?.confirmPassword
        || err?.error?.messages?.role
        || err?.error?.messages?.categories
        || err?.error?.messages?.product
        || err?.error?.messages?.time
        || err?.error?.messages?.task
        || err?.error?.messages?.form
        || err?.error?.messages?.user
        || err?.error?.messages?.date
        || err?.error?.messages?.location
        || err?.error?.messages?.quantity
        || "พบข้อผิดดพลาดในระบบ กรุณาติดต่อเจ้าหน้าที่"

      ,
      icon: 'error',
      showConfirmButton: false,
      timer: delay
    });
  }


}

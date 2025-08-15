import { Injectable } from '@angular/core';
import { DxToastModule, DxToastComponent } from 'devextreme-angular';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  showError(message: string) {
    // ตัวอย่าง DevExtreme Toast
    const toast = document.createElement('dx-toast');
    toast.setAttribute('message', message);
    toast.setAttribute('type', 'error');
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  }
}

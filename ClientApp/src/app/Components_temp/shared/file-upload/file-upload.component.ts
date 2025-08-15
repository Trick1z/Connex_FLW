import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
@Input() uploadUrl: string = '';      // ถ้ามี API อัพโหลด
  @Input() multiple: boolean = false;   // อัพโหลดหลายไฟล์ได้ไหม
  @Input() allowedExtensions: string[] = []; // ประเภทไฟล์ที่อนุญาต

  @Output() filesSelected = new EventEmitter<File[]>(); // ส่งไฟล์ออก

  onValueChanged(e: any) {
    const files: File[] = e.value; // ไฟล์ที่เลือก
    this.filesSelected.emit(files);
  }
}

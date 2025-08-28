import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegisterData } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }


  onRegisterSubmit(param: RegisterData) {
    return this.http.post(`${environment.apiUrl}Authentication/register`, param)
  }

}

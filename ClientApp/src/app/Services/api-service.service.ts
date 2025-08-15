import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
private baseUrl = 'https://localhost:7070';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  post(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post(url, data, { headers: this.getAuthHeaders() });
  }

  get(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  // post(endpoint: string, data: any): Observable<any> {
  //   const url = `${this.baseUrl}/${endpoint}`;
  //   return this.http.post(url, data, { headers: this.getAuthHeaders() });
  // }
  // put(endpoint: string, data: any): Observable<any> {
  //   const url = `${this.baseUrl}/${endpoint}`;
  //   return this.http.put(url, data);
  // }

  //  delete(endpoint: string, data: any): Observable<any> {
  //   const url = `${this.baseUrl}/${endpoint}`;
  //   return this.http.delete(url, { body: data });
  // }
}

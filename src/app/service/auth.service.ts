import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod'; // ✅ adjust path if needed

@Injectable({ providedIn: 'root' })
export class AuthService {

  
  private api = `${environment.apiBaseUrl}/api/auth`;

   

  constructor(private http: HttpClient) {}

  

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/login`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}

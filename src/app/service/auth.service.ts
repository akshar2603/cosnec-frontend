import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod'; // ✅ adjust path if needed

@Injectable({ providedIn: 'root' })
export class AuthService {

  
  private api = `${environment.apiBaseUrl}/api/auth`;

  private localUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/login`, data);
  }

 googleLogin(token: string) {
  return this.http.post(`${this.localUrl}/google`, { id_token: token }); // ✅ match backend
}



  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}

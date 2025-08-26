import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from './address-state.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private baseUrl = 'http://localhost:3000/api'; // <- match your backend

  constructor(private http: HttpClient) {}

  getAddresses(userId: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/address/${userId}`);
  }

  addAddress(userId: string, addr: Address): Observable<Address[]> {
    return this.http.post<Address[]>(`${this.baseUrl}/address/${userId}`, addr);
  }

  updateAddress(userId: string, addressId: string, addr: Partial<Address>): Observable<Address[]> {
    return this.http.put<Address[]>(`${this.baseUrl}/address/${userId}/${addressId}`, addr);
  }

  deleteAddress(userId: string, addressId: string): Observable<Address[]> {
    return this.http.delete<Address[]>(`${this.baseUrl}/address/${userId}/${addressId}`);
  }
}

import { Injectable } from '@angular/core';

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AddressStateService {
  private mem: Record<string, Address[]> = {};

  private key(userId: string) {
    return `addresses:${userId}`;
  }

  load(userId: string): Address[] {
    if (!userId) return [];
    if (this.mem[userId]) return this.mem[userId];
    const raw = localStorage.getItem(this.key(userId));
    const list: Address[] = raw ? JSON.parse(raw) : [];
    this.mem[userId] = list;
    return list;
  }

  save(userId: string, list: Address[]) {
    if (!userId) return;
    this.mem[userId] = Array.isArray(list) ? [...list] : [];
    localStorage.setItem(this.key(userId), JSON.stringify(this.mem[userId]));
  }

  has(userId: string): boolean {
    if (!userId) return false;
    if (this.mem[userId]) return this.mem[userId].length > 0;
    const raw = localStorage.getItem(this.key(userId));
    return !!raw && JSON.parse(raw).length > 0;
  }

  clear(userId: string) {
    if (!userId) return;
    delete this.mem[userId];
    localStorage.removeItem(this.key(userId));
  }
}

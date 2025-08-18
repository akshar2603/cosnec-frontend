import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private cart: any[] = [];

  setCart(cart: any[]) {
    this.cart = cart;
  }

  getCart(): any[] {
    return this.cart;
  } 

  hasCart(): boolean {
    return this.cart.length > 0;
  }

  clearCart() {
    this.cart = [];
  }
}

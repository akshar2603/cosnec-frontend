import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  private products: any[] = [];

  setProducts(products: any[]) {
    this.products = products;
  }

  getProducts(): any[] {
    return this.products;
  }

  hasProducts(): boolean {
    return this.products.length > 0;
  }
}

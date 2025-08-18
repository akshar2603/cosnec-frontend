import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private baseUrl = 'https://cosmos-bnqi.onrender.com/api'; // Main base URL

    private baseUrl = 'https://cosmos-bnqi.onrender.com/api'; // Main base URL

  constructor(private http: HttpClient) {}

  // ================== PRODUCTS ==================
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }

  // ================== CART ==================

  // Fetch cart by userId
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart/${userId}`);
  }

  // Add or update item in cart
  addToCart(userId: string, item: any): Observable<any> {
    // console.log('Adding to cart:', userId, item);
    return this.http.post(`${this.baseUrl}/cart/add`, { userId, item });
  }

  // Remove a single item by productId
  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/remove`, { userId, productId });
  }

  // Update item quantity (calls the same add route as addToCart)
  updateCartItem(userId: string, item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, { userId, item });
  }

  // Optional: clear the entire cart (if you add a backend route for it)
  clearCart(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/clear`, { userId });
  }

  // ================== AUTH / SUBSCRIBE ==================

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  subscribe(email: string, userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/subscribe`, { email, userId });
  }
}
  
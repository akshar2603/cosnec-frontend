import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://cosnec-backend.onrender.com/api';

  private localUrl =  'http://localhost:3000/api' ; 

  constructor(private http: HttpClient) {}

  // ✅ PRODUCTS
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

// ✅ Upload images to Cloudinary (via backend)
uploadImages(files: { file: File; order: number }[]): Observable<{ urls: string[] }> {
  const formData = new FormData();
  files.forEach(f => {
    formData.append('files', f.file);
    formData.append('orders', f.order.toString()); // send order as well
  });
  return this.http.post<{ urls: string[] }>(
    `${this.baseUrl.replace('/api', '')}/upload/multiple`,
    formData
  );
}

// ✅ CREATE product with ordered images
createProductWithImages(product: any, files: { file: File; order: number }[]): Observable<any> {
  if (files.length === 0) return this.http.post(`${this.baseUrl}/products`, product);

  return new Observable(observer => {
    this.uploadImages(files).subscribe({
      next: (res) => {
        product.images = res.urls; // backend already sends ordered URLs
        this.http.post(`${this.baseUrl}/products`, product).subscribe({
          next: (response) => { observer.next(response); observer.complete(); },
          error: (err) => observer.error(err)
        });
      },
      error: (err) => observer.error(err)
    });
  });
}

// ✅ UPDATE product with ordered images
updateProductWithImages(productId: string, productData: any, files: { file: File; order: number }[]): Observable<any> {
  if (files.length === 0) return this.http.put(`${this.baseUrl}/products/${productId}`, productData);

  return new Observable(observer => {
    this.uploadImages(files).subscribe({
      next: (res) => {
        productData.images = res.urls; // backend ensures correct order
        this.http.put(`${this.baseUrl}/products/${productId}`, productData).subscribe({
          next: (response) => { observer.next(response); observer.complete(); },
          error: (err) => observer.error(err)
        });
      },
      error: (err) => observer.error(err)
    });
  });
}
  

  deleteProductImage(productId: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/products/${productId}`);
}





  // ✅ CART
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart/${userId}`);
  }

  addToCart(userId: string, item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, { userId, item });
  }

  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/remove`, { userId, productId });
  }

  updateCartItem(userId: string, item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, { userId, item });
  }

  clearCart(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/clear`, { userId });
  }

  // ✅ AUTH
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  subscribe(email: string, userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/subscribe`, { email, userId });
  }

  // ✅ PAYMENT
  createRazorpayOrder(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/payment/create-order`, { amount });
  }

  verifyRazorpayPayment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payment/verify-payment`, data);
  }
}

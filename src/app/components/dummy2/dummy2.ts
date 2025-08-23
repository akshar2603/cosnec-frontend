import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api-service';
import {
  RouterModule,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductStateService } from '../../service/product-state.service';
import { filter } from 'rxjs/internal/operators/filter';
import { AuthService } from '../../service/auth.service';
import { CartStateService } from '../../service/cart-state.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-dummy2',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dummy2.html',
  styleUrls: ['./dummy2.css'],
})
export class Dummy2 implements OnInit {
  subscriberEmail = '';
  cartOpen = false;
  cart: any[] = [];
  loadingCart = true;
  products: any[] = [];
  filteredProducts: any[] = [];
  len = 0;
  loggedIn = false;
  profileOpen = false;
  userId: string = '';
  currentImageIndex: number[] = [];
  showDialog = false;
  newProduct = {
    name: '',
    brand: '',
    category: '',
    price: 0,
  images: [] as string[], // ✅ multiple images
    description: '',
    stock: 0,
  };
  selectedFile: File | null = null;
  uploading = false;

  showUpdateDialog = false;
  editProduct: any = {};
  selectedEditFile: File | null = null;
  searchQuery: string = '';

  nextImage(i: number, total: number) {
  this.currentImageIndex[i] = (this.currentImageIndex[i] + 1) % total;
}

prevImage(i: number, total: number) {
  this.currentImageIndex[i] =
    (this.currentImageIndex[i] - 1 + total) % total;
}

  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient,
    private productState: ProductStateService,
    private auth: AuthService,
    private cartState: CartStateService,
    private route: ActivatedRoute,
        private cd: ChangeDetectorRef 

  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  ngOnInit(): void {
    // 🌐 Access localStorage safely (SPA only)
    this.userId = localStorage.getItem('userId') || '';
    



    this.checkLoginStatus();
    document.addEventListener('click', (event: any) => {
      if (!event.target.closest('.profile-wrapper')) {
        this.profileOpen = false;
      }
    });

    if (this.productState.hasProducts()) {
  this.products = this.productState.getProducts();
  this.filteredProducts = [...this.products];
  this.currentImageIndex = new Array(this.filteredProducts.length).fill(0);
  this.cd.detectChanges();
} else {
  this.apiService.getProducts().subscribe((res: any) => {
    this.products = res;
    this.filteredProducts = [...res];
    this.currentImageIndex = new Array(this.filteredProducts.length).fill(0);
    this.productState.setProducts(res);
    this.cd.detectChanges();
  });
}


    if (this.userId) {
      if (this.cartState.hasCart()) {
        this.cart = this.cartState.getCart();
        this.loadingCart = false;
      } else {
        this.loadCart();
      }
    } else {
      this.loadingCart = false;
    }
  }

  searchProducts() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter((p) =>
      p.name?.toLowerCase().includes(query)
    );
  }

  loadCart() {
    this.apiService.getCart(this.userId).subscribe((data) => {
      this.cart = data?.items || [];
      this.cartState.setCart(this.cart);
      this.loadingCart = false;
    });
  }

  addToCart(product: any) {
    const existing = this.cart.find((p) => p.productId === product._id);
    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({ ...product, productId: product._id, qty: 1 });
    }

    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    };

    this.apiService.addToCart(this.userId, item).subscribe((res) => {
     
    });

    this.cartOpen = true;
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.filteredProducts = [...data];
        this.len = data.length;
         this.currentImageIndex = new Array(this.len).fill(0); // ✅ initialize
           this.cd.detectChanges();
        
      },
      error: (err) => console.error('❌ Error fetching products:', err),
    });
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.loggedIn = !!token;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loggedIn = false;

    this.userId = '';
    this.cart = [];
    this.cartState.clearCart(); // ✅ Optional: if you have this method

    this.productState.setProducts([]); // ✅ Clear cached products
    this.loadProducts(); // ✅ Reload to show fresh state for guest

    this.router.navigate(['/']);
  }

  get cartCount(): number {
    return this.cart.reduce((a, c) => a + c.qty, 0);
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  increaseQty(item: any) {
    item.qty++;
    this.updateItemQty(item);
  }

  decreaseQty(item: any) {
    if (item.qty > 1) {
      item.qty--;
      this.updateItemQty(item);
    } else {
      this.removeItem(item);
    }
  }

  updateItemQty(item: any) {
    const body = {
      userId: this.userId,
      productId: item.productId,
      qty: item.qty,
    };
    this.http.put('https://cosmos-bnqi.onrender.com/api/cart/update-qty', body).subscribe({
      error: (err) => console.error('Failed to update quantity', err),
    });
  }

  removeItem(item: any) {
    const confirmDelete = confirm(`Remove "${item.name}" from cart?`);
    if (!confirmDelete) return;

    this.cart = this.cart.filter((i) => i !== item);
    this.apiService.removeFromCart(this.userId, item.productId).subscribe({
      error: (err) => console.error('❌ Failed to remove from cart:', err),
    });
  }


  get subtotal(): number {
    return this.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }


  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.newProduct = {
      name: '',
      brand: '',
      category: '',
      price: 0,
      images: [],
      description: '',
      stock: 0,
    };
    this.selectedFile = null;
  }




  subscribe() {
    const userId = localStorage.getItem('userId');
    if (!this.subscriberEmail || !userId) {
      alert('Please enter email and ensure you’re logged in.');
      return;
    }

    this.http
      .post('https://cosmos-bnqi.onrender.com/api/auth/subscribe', {
        email: this.subscriberEmail,
        userId,
      })
      .subscribe({
        next: () => {
          alert('✅ Subscription successful! Check your email.');
          this.subscriberEmail = '';
        },
        error: () => {
          alert('❌ Failed to subscribe.');
        },
      });
  }
}
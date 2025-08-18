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

  showDialog = false;
  newProduct = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    image: '',
    description: '',
    stock: 0,
  };
  selectedFile: File | null = null;
  uploading = false;

  showUpdateDialog = false;
  editProduct: any = {};
  selectedEditFile: File | null = null;
  searchQuery: string = '';

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
    

    console.log('🔍 User ID:', this.userId);

    this.checkLoginStatus();
    document.addEventListener('click', (event: any) => {
      if (!event.target.closest('.profile-wrapper')) {
        this.profileOpen = false;
      }
    });

    if (this.productState.hasProducts()) {
      this.products = this.productState.getProducts();
      this.filteredProducts = [...this.products];
      this.cd.detectChanges(); // <-- force update
    } else {
      this.apiService.getProducts().subscribe((res: any) => {
        this.products = res;
        this.filteredProducts = [...res];
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
      console.log('Item added to backend cart', res);
    });

    this.cartOpen = true;
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.filteredProducts = [...data];
        this.len = data.length;
        console.log('✅ Products loaded:', this.products);
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
      next: (res: any) => console.log('Quantity updated:', res),
      error: (err) => console.error('Failed to update quantity', err),
    });
  }

  removeItem(item: any) {
    const confirmDelete = confirm(`Remove "${item.name}" from cart?`);
    if (!confirmDelete) return;

    this.cart = this.cart.filter((i) => i !== item);
    this.apiService.removeFromCart(this.userId, item.productId).subscribe({
      next: () => console.log('🗑️ Removed from backend cart:', item.productId),
      error: (err) => console.error('❌ Failed to remove from cart:', err),
    });
  }

  get subtotal(): number {
    return this.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }

  clicked() {
    console.log('🛒 Checkout clicked');
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
      image: '',
      description: '',
      stock: 0,
    };
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createProduct() {
    if (!this.selectedFile) {
      alert('⚠️ Select image first!');
      return;
    }
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http
      .post<{ url: string }>('https://cosmos-bnqi.onrender.com/upload', formData)
      .subscribe({
        next: (res) => {
          this.newProduct.image = res.url;
          this.http
            .post('https://cosmos-bnqi.onrender.com/api/products', this.newProduct)
            .subscribe({
              next: () => {
                this.uploading = false;
                this.closeDialog();
                this.loadProducts();
              },
              error: (err) => {
                console.error('❌ Product creation failed', err);
                this.uploading = false;
              },
            });
        },
        error: (err) => {
          console.error('❌ Image upload failed', err);
          this.uploading = false;
        },
      });
  }

  openUpdateDialog(item: any) {
    console.log('✏️ Opening update dialog for:', item._id);
    this.editProduct = { ...item };
    this.showUpdateDialog = true;
  }

  closeUpdateDialog() {
    this.showUpdateDialog = false;
    this.editProduct = {};
    this.selectedEditFile = null;
  }

  onEditFileSelected(event: any) {
    this.selectedEditFile = event.target.files[0];
  }

  updateProductSave() {
    if (!this.editProduct._id) {
      console.error('❌ Missing ID');
      return;
    }

    const updateCall = () => {
      this.http
        .put(
          `https://cosmos-bnqi.onrender.com/api/products/${this.editProduct._id}`,
          this.editProduct
        )
        .subscribe({
          next: () => {
            console.log('✅ Product updated');
            this.closeUpdateDialog();
            this.loadProducts();
          },
          error: (err) => console.error('❌ Update failed', err),
        });
    };

    if (this.selectedEditFile) {
      const formData = new FormData();
      formData.append('file', this.selectedEditFile);
      this.http
        .post<{ url: string }>('https://cosmos-bnqi.onrender.com/upload', formData)
        .subscribe({
          next: (res) => {
            this.editProduct.image = res.url;
            updateCall();
          },
          error: (err) => console.error('❌ Image upload failed', err),
        });
    } else {
      updateCall();
    }
  }

  deleteProduct(item: any) {
    if (!confirm('Are you sure to delete?')) return;
    this.http
      .delete(`https://cosmos-bnqi.onrender.com/api/products/${item._id}`)
      .subscribe({
        next: () => {
          console.log('🗑️ Product deleted:', item._id);
          this.products = this.products.filter((p) => p._id !== item._id);
          this.filteredProducts = this.filteredProducts.filter(
            (p) => p._id !== item._id
          );
        },
        error: (err) => console.error('❌ Delete failed', err),
      });
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
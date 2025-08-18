import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api-service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductStateService } from '../../service/product-state.service';
import { filter } from 'rxjs/internal/operators/filter';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  loggedIn = false;
  profileOpen = false;
  userId: string = '';

  products: any[] = [];
  filteredProducts: any[] = [];
  len = 0;

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
    private cd: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    document.addEventListener('click', (event: any) => {
      if (!event.target.closest('.profile-wrapper')) {
        this.profileOpen = false;
      }
    });
    this.checkLoginStatus();

    if (this.productState.hasProducts()) {
      this.products = this.productState.getProducts();
      this.filteredProducts = [...this.products];
      this.cd.detectChanges();
    } else {
      this.apiService.getProducts().subscribe((res: any) => {
        this.products = res;
        this.filteredProducts = [...res];
        this.productState.setProducts(res);
        this.cd.detectChanges();
      });
    }
  }

  searchProducts() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter(p =>
      p.name?.toLowerCase().includes(query)
    );
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.loggedIn = !!token;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loggedIn = false;
    this.router.navigate(['/']);
  }

  // --- Product CRUD ---

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

    this.http.post<{ url: string }>('https://cosmos-bnqi.onrender.com/upload', formData).subscribe({
      next: (res) => {
        this.newProduct.image = res.url;
        this.http.post('https://cosmos-bnqi.onrender.com/api/products', this.newProduct).subscribe({
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
      this.http.put(`https://cosmos-bnqi.onrender.com/api/products/${this.editProduct._id}`, this.editProduct).subscribe({
        next: () => {
          this.closeUpdateDialog();
          this.loadProducts();
        },
        error: (err) => console.error('❌ Update failed', err),
      });
    };

    if (this.selectedEditFile) {
      const formData = new FormData();
      formData.append('file', this.selectedEditFile);
      this.http.post<{ url: string }>('https://cosmos-bnqi.onrender.com/upload', formData).subscribe({
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
    this.http.delete(`https://cosmos-bnqi.onrender.com/api/products/${item._id}`).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p._id !== item._id);
        this.filteredProducts = this.filteredProducts.filter((p) => p._id !== item._id);
        this.cd.detectChanges();
      },
      error: (err) => console.error('❌ Delete failed', err),
    });
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.filteredProducts = [...data];
        this.len = data.length;
        this.cd.detectChanges();
      },
      error: (err) => console.error('❌ Error fetching products:', err),
    });
  }
}
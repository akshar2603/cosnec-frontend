import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api-service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductStateService } from '../../service/product-state.service';
import { filter } from 'rxjs/operators';
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
<<<<<<< HEAD
  selectedFiles: File[] = [];
=======
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
  products: any[] = [];
  filteredProducts: any[] = [];
  len = 0;

  showDialog = false;
  newProduct = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    images: [] as string[], // ✅ store multiple image URLs
    description: '',
    stock: 0,
  };
  uploading = false;

<<<<<<< HEAD
  showUpdateDialog = false;
  editProduct: any = {};
  selectedEditFiles: File[] = []; // ✅ support multiple files for update
=======
  showUpdateDialog = false
  editProduct: any = {};
  selectedFiles: { file: File, order: number }[] = [];

  selectedEditFiles: { file: File, order: number }[] = []; // <-- add this

>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
  searchQuery: string = '';
  currentImageIndex: number[] = [];

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
      
      this.loadProducts();
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

  // -------------------- CREATE PRODUCT --------------------

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
    this.selectedFiles = [];
  }
<<<<<<< HEAD

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  createProduct() {
    if (this.selectedFiles.length === 0) {
      alert('⚠️ Select at least one image!');
      return;
    }

    this.uploading = true;
    const formData = new FormData();
    this.selectedFiles.forEach((file) => formData.append('files', file));

    this.apiService.uploadImages(this.selectedFiles).subscribe({
  next: (res) => {
    this.newProduct.images = res.urls;
    this.apiService.createProduct(this.newProduct).subscribe({
      next: () => { this.uploading = false; this.closeDialog(); this.loadProducts(); },
      error: (err) => { console.error('❌ Product creation failed', err); this.uploading = false; }
    });
  }
});

  }


  
  // -------------------- UPDATE PRODUCT --------------------

=======
  
  // -------------------- UPDATE PRODUCT --------------------


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



>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
  openUpdateDialog(item: any) {
    this.editProduct = { ...item };
    this.showUpdateDialog = true;
  }

  closeUpdateDialog() {
    this.showUpdateDialog = false;
    this.editProduct = {};
    this.selectedEditFiles = [];
  }

<<<<<<< HEAD
  onEditFilesSelected(event: any) {
    this.selectedEditFiles = Array.from(event.target.files);
  }

=======
onFilesSelected(event: any) {
  const files = Array.from(event.target.files) as File[];
  this.selectedFiles = files.map((file, index) => ({ file, order: index }));
}

createProduct() {
  if (this.selectedFiles.length === 0) {
    alert('⚠️ Select at least one image!');
    return;
  }

  this.uploading = true;

  this.apiService.createProductWithImages(this.newProduct, this.selectedFiles).subscribe({
    next: () => {
      this.uploading = false;
      this.closeDialog();
      this.loadProducts();
    },
    error: (err) => {
      console.error('❌ Product creation failed', err);
      this.uploading = false;
    }
  });
}

onEditFilesSelected(event: any) {
  const files = Array.from(event.target.files) as File[];
  this.selectedEditFiles = files.map((file, index) => ({ file, order: index }));
}

>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
updateProductSave() {
  if (!this.editProduct._id) {
    console.error('❌ Missing ID');
    return;
  }

  this.apiService.updateProductWithImages(this.editProduct._id, this.editProduct, this.selectedEditFiles)
    .subscribe({
      next: () => {
        this.closeUpdateDialog();
        this.loadProducts();
        console.log('✅ Product updated successfully');
      },
      error: (err) => console.error('❌ Update failed', err)
    });
}


  deleteProduct(item: any) {
  if (!confirm('Are you sure to delete?')) return;

  this.apiService.deleteProductImage(item._id).subscribe({
    next: () => {
      this.products = this.products.filter((p) => p._id !== item._id);
      this.filteredProducts = this.filteredProducts.filter((p) => p._id !== item._id);
      this.cd.detectChanges();
    },
    error: (err) => console.error('❌ Delete failed', err),
  });
}

<<<<<<< HEAD

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



=======
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
}

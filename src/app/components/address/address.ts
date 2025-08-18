import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './address.html',
  styleUrls: ['./address.css']
})
export class Address implements OnInit {
  // ---------------------------------
  // 🔹 STATE
  // ---------------------------------
  addresses: any[] = [];            // All addresses from backend
  selectedAddressId: string = '';   // Currently selected address
  userId: string = '';              // Logged in user ID (from localStorage)
  editingAddressId: string = '';    // Currently editing address ID

  // modal and edit mode state
  showModal = false;
  isEditMode = false;

  // ---------------------------------
  // 🔹 FORM MODEL (no _id field)
  // ---------------------------------
  addressForm = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  // ---------------------------------
  // 🔹 INIT
  // ---------------------------------
  ngOnInit(): void {
    // ✅ Only run localStorage in browser (SSR safe)
    if (isPlatformBrowser(this.platformId)) {
      const id = localStorage.getItem('userId');
      this.userId = id || '';
      if (this.userId) {
        this.loadAddresses();
      }
    }
  }

  // ---------------------------------
  // 🔹 API METHODS
  // ---------------------------------

  /** Load addresses from backend */
  loadAddresses() {
    this.http.get<any[]>(`https://cosmos-bnqi.onrender.com/api/auth/addresses/${this.userId}`).subscribe({
      next: (data) => {
        this.addresses = data;
        // auto-select default
        const def = this.addresses.find(a => a.isDefault);
        this.selectedAddressId = def?._id || '';
      },
      error: (err) => console.error('❌ Error fetching addresses:', err)
    });
  }

  /** Open modal for adding new address */
  onAdd() {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  /** Open modal for editing selected address */
  onEdit() {
    if (!this.selectedAddressId) {
      alert('⚠️ Please select an address first!');
      return;
    }
    const addr = this.addresses.find(a => a._id === this.selectedAddressId);
    if (!addr) return;

    this.isEditMode = true;
    this.editingAddressId = addr._id;
    this.addressForm = {
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || '',
      isDefault: addr.isDefault || false
    };
    this.showModal = true;
  }

  /** Delete selected address */
  onDelete() {
    if (!this.selectedAddressId) {
      alert('⚠️ Please select an address first!');
      return;
    }
    if (!confirm('🗑️ Are you sure you want to delete this address?')) return;

    this.http
      .delete<any[]>(`https://cosmos-bnqi.onrender.com/api/auth/addresses/${this.userId}/${this.selectedAddressId}`)
      .subscribe({
        next: (data) => {
          this.addresses = data;
          this.selectedAddressId = '';
        },
        error: (err) => console.error('❌ Error deleting address:', err)
      });
  }

  /** Save address (handles both add & edit) */
  saveAddress() {
    if (this.isEditMode) {
      // Update existing
      this.http
        .put<any[]>(
          `https://cosmos-bnqi.onrender.com/api/auth/addresses/${this.userId}/${this.editingAddressId}`,
          this.addressForm
        )
        .subscribe({
          next: (data) => {
            this.addresses = data;
            this.closeModal();
          },
          error: (err) => console.error('❌ Error updating address:', err)
        });
    } else {
      console.log(this.userId)
      console.log("i am user id"); 
      // Add new
      this.http
        .post<any[]>(`https://cosmos-bnqi.onrender.com/api/auth/addresses/${this.userId}`, this.addressForm)
        .subscribe({
          next: (data) => {
            this.addresses = data;
            this.closeModal();
          },
          error: (err) => console.error('❌ Error adding address:', err)
        });
    }
  }

  // ---------------------------------
  // 🔹 MODAL HELPERS
  // ---------------------------------
  closeModal() {
    console.log('✅ Closing modal');
    this.showModal = false;
    this.resetForm();
    this.editingAddressId = '';
  }

  
  resetForm() {
    this.addressForm = {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    };
  }
}

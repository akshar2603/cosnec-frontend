<<<<<<< HEAD
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
=======
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddressService } from '../../service/address.service';
import { AddressStateService, Address as AddressModel } from '../../service/address-state.service';
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './address.html',
  styleUrls: ['./address.css']
})
export class Address implements OnInit {
<<<<<<< HEAD
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
=======
  selectedAddressId = '';
  userId = '';
  addresses: AddressModel[] = [];

  showModal = false;
  isEditMode = false;
  addressForm: AddressModel = this.getEmptyForm();

  constructor(
    private addressService: AddressService,
    private addressState: AddressStateService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';

    // 1) Restore instantly from cache (no flash of empty)
    this.addresses = this.addressState.load(this.userId);

    // 2) Always refresh from backend (authoritative)
    this.refreshFromServer();
  }

  private refreshFromServer() {
    if (!this.userId) return;
    this.addressService.getAddresses(this.userId).subscribe({
      next: (res) => {
        this.addresses = Array.isArray(res) ? res : [];
        this.addressState.save(this.userId, this.addresses);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching addresses:', err),
    });
  }

  private getEmptyForm(): AddressModel {
    return {
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
<<<<<<< HEAD
      country: '',
      isDefault: false
    };
  }
=======
      country: 'India',
      isDefault: false
    };
  }

  openModal(isEdit: boolean) {
    this.isEditMode = isEdit;
    this.showModal = true;
    if (isEdit && this.selectedAddressId) {
      const addr = this.addresses.find(a => a._id === this.selectedAddressId);
      this.addressForm = addr ? { ...addr } as AddressModel : this.getEmptyForm();
    } else {
      this.addressForm = this.getEmptyForm();
    }
  }

  closeModal() {
    this.showModal = false;
    this.addressForm = this.getEmptyForm();
  }

  saveAddress() {
    if (!this.userId) return;

    if (this.isEditMode && this.selectedAddressId) {
      this.addressService
        .updateAddress(this.userId, this.selectedAddressId, this.addressForm)
        .subscribe({
          next: (res) => {
            this.addresses = res ?? [];
            this.addressState.save(this.userId, this.addresses);
            this.closeModal();
            this.cd.detectChanges();
          },
          error: (err) => console.error('Error updating address:', err)
        });
    } else {
      this.addressService.addAddress(this.userId, this.addressForm).subscribe({
        next: (res) => {
          this.addresses = res ?? [];
          this.addressState.save(this.userId, this.addresses);
          this.closeModal();
          this.cd.detectChanges();
        },
        error: (err) => console.error('Error adding address:', err)
      });
    }
  }

  onDelete() {
    if (!this.userId || !this.selectedAddressId) return;
    const ok = confirm('Are you sure you want to delete this address?');
    if (!ok) return;

    this.addressService.deleteAddress(this.userId, this.selectedAddressId).subscribe({
      next: (res) => {
        this.addresses = res ?? [];
        this.addressState.save(this.userId, this.addresses);
        this.selectedAddressId = '';
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error deleting address:', err)
    });
  }

  // optional: better DOM updates
  trackById(_i: number, a: AddressModel) {
    return a._id;
  }
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
}

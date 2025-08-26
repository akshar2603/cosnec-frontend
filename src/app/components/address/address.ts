import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddressService } from '../../service/address.service';
import { AddressStateService, Address as AddressModel } from '../../service/address-state.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './address.html',
  styleUrls: ['./address.css']
})
export class Address implements OnInit {
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
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
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
}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api-service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit, OnDestroy {
  userId: string = '';
  cartItems: any[] = [];
  total: number = 0;
  cartLoaded: boolean = false;
  private navSub?: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.setUserIdAndFetchCart();

    this.navSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.setUserIdAndFetchCart());
  }
}

setUserIdAndFetchCart(): void {
  this.userId = localStorage.getItem('userId') || '';
  if (!this.userId) {
    console.error('❌ User not logged in');
    this.cartLoaded = true;
    this.cartItems = [];
    this.cd.detectChanges();
    return;
  }
  this.fetchCart();
}

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  fetchCart(): void {
  this.cartLoaded = false;
  this.apiService.getCart(this.userId).subscribe({
    next: (res: any) => {
      console.log('API Response:', res);
      // Try all possible locations for items
      this.cartItems = res?.data?.items || res?.items || res?.cartItems || [];
      if (!Array.isArray(this.cartItems)) {
        this.cartItems = [];
      }
      console.log('Updated cartItems:', this.cartItems);
      this.calculateTotal();
      this.cartLoaded = true;
      this.cd.detectChanges();
    },
    error: err => {
      console.error('❌ Error fetching cart:', err);
      this.cartLoaded = true;
      this.cd.detectChanges();
    }
  });
}



  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }
}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api-service';
<<<<<<< HEAD
=======
import { Location } from '@angular/common';

>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3

declare var Razorpay: any;

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
<<<<<<< HEAD
=======
    private location: Location,
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
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

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
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
<<<<<<< HEAD
=======
  goBack() {
    this.location.back(); // 🔙 goes one page back
  }
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3

  fetchCart(): void {
    this.cartLoaded = false;
    this.apiService.getCart(this.userId).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
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

<<<<<<< HEAD
  payWithRazorpay(): void {
    console.log('Initiating Razorpay payment for amount:', this.total);
    if (!this.total || this.total <= 0) {
      alert('Cart is empty or invalid amount!');
      return;
    }

    Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      alert('Razorpay SDK not loaded. Please try again later.');
      return;
    }

    // Call backend to create Razorpay order
    this.apiService.createRazorpayOrder(this.total).subscribe({
      next: (res: any) => {
        if (res.success) {
          const options = {
            key: '876543245667864305895', // Replace with your actual Razorpay Key ID
            amount: res.order.amount, // Amount in paise
            currency: 'INR',
            name: 'My Store',
            description: 'Order Payment',
            order_id: res.order.id,
            handler: (response: any) => {
              console.log('Payment Success:', response);

              // Verify payment with backend
              this.apiService.verifyRazorpayPayment(response).subscribe((verifyRes: any) => {
                if (verifyRes.success) {
                  alert('✅ Payment Successful!');
                  this.router.navigate(['/order-success']);
                } else {
                  alert('❌ Payment Verification Failed');
                }
              });
            },
            prefill: {
              email: 'customer@example.com',
              contact: '9999999999'
            },
            theme: {
              color: '#3399cc'
            }
          };

          const rzp = new Razorpay(options);
          rzp.open();
        }
      },
      error: err => {
        console.error('❌ Error creating Razorpay order:', err);
      }
    });
  }
=======
  // payWithRazorpay(): void {
  //   console.log('Initiating Razorpay payment for amount:', this.total);
  //   if (!this.total || this.total <= 0) {
  //     alert('Cart is empty or invalid amount!');
  //     return;
  //   }

  //   Razorpay = (window as any).Razorpay;
  //   if (!Razorpay) {
  //     alert('Razorpay SDK not loaded. Please try again later.');
  //     return;
  //   }

  //   // Call backend to create Razorpay order
  //   this.apiService.createRazorpayOrder(this.total).subscribe({
  //     next: (res: any) => {
  //       if (res.success) {
  //         const options = {
  //           key: '876543245667864305895', // Replace with your actual Razorpay Key ID
  //           amount: res.order.amount, // Amount in paise
  //           currency: 'INR',
  //           name: 'My Store',
  //           description: 'Order Payment',
  //           order_id: res.order.id,
  //           handler: (response: any) => {
  //             console.log('Payment Success:', response);

  //             // Verify payment with backend
  //             this.apiService.verifyRazorpayPayment(response).subscribe((verifyRes: any) => {
  //               if (verifyRes.success) {
  //                 alert('✅ Payment Successful!');
  //                 this.router.navigate(['/order-success']);
  //               } else {
  //                 alert('❌ Payment Verification Failed');
  //               }
  //             });
  //           },
  //           prefill: {
  //             email: 'customer@example.com',
  //             contact: '9999999999'
  //           },
  //           theme: {
  //             color: '#3399cc'
  //           }
  //         };

  //         const rzp = new Razorpay(options);
  //         rzp.open();
  //       }
  //     },
  //     error: err => {
  //       console.error('❌ Error creating Razorpay order:', err);
  //     }
  //   });
  // }
>>>>>>> fb69f569f0bc0ec8e570e247ec4829564b1ec4d3
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  shipping = 9.99;
  taxRate = 0.08;

  form = {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  };

  card = {
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  };

  selectedPayment = 'credit';

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateSubtotal();
    });
  }

  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get tax() {
    return this.subtotal * this.taxRate;
  }

  get total() {
    return this.subtotal + this.shipping + this.tax;
  }

  setPaymentMethod(method: string) {
    this.selectedPayment = method;
  }

  placeOrder() {
    const allFormFilled = Object.values(this.form).every(val => val.trim() !== '');
    const allCardFilled = this.selectedPayment === 'credit'
      ? Object.values(this.card).every(val => val.trim() !== '')
      : true;

    if (!allFormFilled || !allCardFilled) {
      alert('⚠️ Please fill in all required fields.');
      return;
    }

    const productIds = this.cartItems.map(item => item.id);

    this.orderService.placeOrder(productIds).subscribe({
      next: () => {
        alert('✅ Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/view-orders']);
      },
      error: (err) => {
        console.error('❌ Failed to place order:', err);
        alert('❌ Could not place order. Please ensure you are logged in as a customer.');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  shipping = 9.99;
  taxRate = 0.08;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items: any[]) => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get total(): number {
    return this.subtotal + this.tax + this.shipping;
  }

  increaseQty(item: any) {
    if (item.quantity < item.stock) {
      this.cartService.changeQuantity(item.id, 1);
    }
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      this.cartService.changeQuantity(item.id, -1);
    }
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item.id);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}

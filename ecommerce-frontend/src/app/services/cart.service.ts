// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category?: string;
  stock?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart';

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(this.getCartCountFromStorage());
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {}

  // 🔄 LocalStorage → Memory
  private getCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getCartCountFromStorage(): number {
    const items = this.getCartFromStorage();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // 💾 Save + Notify
  private updateCart(items: CartItem[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.cartItemsSubject.next(items);
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(totalCount);
  }

  // ➕ Add or Increment
  addToCart(product: CartItem) {
    const items = this.getCartFromStorage();
    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      if (existing.stock && existing.quantity >= existing.stock) return; // ✅ Prevent overstock
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    this.updateCart(items);
  }

  // ➖ Increase/Decrease
  changeQuantity(productId: number, change: number) {
    const items = this.getCartFromStorage();
    const index = items.findIndex((item) => item.id === productId);

    if (index > -1) {
      items[index].quantity += change;

      if (items[index].quantity <= 0) {
        items.splice(index, 1);
      }

      this.updateCart(items);
    }
  }

  // ❌ Remove from Cart
  removeFromCart(productId: number) {
    const items = this.getCartFromStorage().filter((item) => item.id !== productId);
    this.updateCart(items);
  }

  // 🧼 Clear Entire Cart
  clearCart() {
    this.updateCart([]);
  }

  // 📦 Get Items (sync if needed)
  getCartItems(): CartItem[] {
    return this.getCartFromStorage();
  }

  // 🔢 Get Count (sync if needed)
  getCartItemCount(): number {
    return this.getCartFromStorage().reduce((sum, item) => sum + item.quantity, 0);
  }
}

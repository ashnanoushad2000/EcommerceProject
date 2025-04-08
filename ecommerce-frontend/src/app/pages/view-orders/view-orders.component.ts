import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service'; // ✅

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [OrderService],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage = '';
  loading = false;

  showRatingModal = false;
  selectedProduct: string = '';

  constructor(
    @Inject(OrderService) private orderService: OrderService,
    private cartService: CartService // ✅
  ) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (data: any[]) => {
        this.orders = data;
      },
      error: () => {
        this.errorMessage = '⚠️ You must be logged in to view your orders.';
      }
    });
  }

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.loading = true;
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.orders = this.orders.map(order =>
            order.id === orderId ? { ...order, status: 'Cancelled' } : order
          );
          this.loading = false;
        },
        error: () => {
          alert('❌ Failed to cancel order.');
          this.loading = false;
        }
      });
    }
  }

  reorder(product: any) {
    this.cartService.addToCart(product); // ✅
    alert('✅ Product added to cart!');
  }

  createStars(rating: number): number[] {
    return Array(Math.floor(rating || 0)).fill(0);
  }

  openRating(productName: string) {
    this.selectedProduct = productName;
    this.showRatingModal = true;
  }

  closeRating() {
    this.showRatingModal = false;
    this.selectedProduct = '';
  }

  submitRating(stars: number) {
    alert(`⭐ You rated ${this.selectedProduct} with ${stars} stars!`);
    this.closeRating();
  }
}

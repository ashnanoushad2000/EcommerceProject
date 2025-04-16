import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage = '';
  loading = false;

  showRatingModal = false;
  selectedProductId: number = 0;
  selectedProductName: string = '';
  selectedRating: number = 0;

  constructor(
    @Inject(OrderService) private orderService: OrderService,
    private cartService: CartService,
    private productService: ProductService
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
    this.cartService.addToCart(product);
    alert('✅ Product added to cart!');
  }

  createStars(rating: number): number[] {
    return Array(Math.round(rating || 0)).fill(0);
  }

  openRating(productId: number, productName: string) {
    this.selectedProductId = productId;
    this.selectedProductName = productName;
    this.selectedRating = 0;
    this.showRatingModal = true;
  }

  closeRating() {
    this.showRatingModal = false;
    this.selectedRating = 0;
    this.selectedProductName = '';
  }

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  submitRating() {
    if (this.selectedRating > 0) {
      this.productService.rateProduct(this.selectedProductId, this.selectedRating).subscribe({
        next: () => {
          this.orders = this.orders.map(order => {
            order.orderProducts = order.orderProducts.map((op: any) => {
              if (op.product.id === this.selectedProductId) {
                const newCount = op.product.ratingCount + 1;
                const totalScore = (op.product.rating * op.product.ratingCount) + this.selectedRating;
                op.product.ratingCount = newCount;
                op.product.rating = Math.round((totalScore / newCount) * 10) / 10;
              }
              return op;
            });
            return order;
          });

          alert(`⭐ You rated ${this.selectedProductName} with ${this.selectedRating} stars!`);
          this.closeRating();
        },
        error: () => {
          alert('❌ Failed to submit rating.');
        }
      });
    } else {
      alert('⚠️ Please select a star rating before submitting.');
    }
  }
}
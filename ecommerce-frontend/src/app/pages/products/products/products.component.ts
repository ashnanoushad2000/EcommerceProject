import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { SearchService } from '../../../services/search.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  countdown: string = '';

  constructor(
    private productService: ProductService,
    private searchService: SearchService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCountdown();
    this.fetchProducts();
    this.setupSearchSubscription();
  }

  private fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = res;
      },
      error: (err) => {
        console.error('❌ Failed to load products:', err);
      },
    });
  }

  private setupSearchSubscription() {
    this.searchService.currentQuery$.subscribe((query: string) => {
      const trimmed = query.trim().toLowerCase();
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(trimmed)
      );
    });
  }

  getStars(rating: number): any[] {
    return Array(Math.floor(rating));
  }

  loadCountdown() {
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);
    setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      if (diff > 0) {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        this.countdown = `${hrs.toString().padStart(2, '0')}:${mins
          .toString()
          .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        this.countdown = '00:00:00';
      }
    }, 1000);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`✅ '${product.name}' added to cart!`);
  }

  onDealClick() {
    alert('🎧 Viewing Deal of the Day: Premium Wireless Headphones!');
  }
}

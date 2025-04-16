import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  cartItemCount = 0;
  showDropdown = false;
  sidebarOpen = false;

  constructor(
    private cartService: CartService,
    private searchService: SearchService
  ) {
    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartItemCount = count;
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchService.setQuery(input.value);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

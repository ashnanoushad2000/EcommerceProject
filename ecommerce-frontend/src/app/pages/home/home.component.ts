import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

// ✅ Import your popup component — FIX THE PATH if it's different
import { SurpriseGiftComponent } from '../../shared/surprise-gift/surprise-gift.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SurpriseGiftComponent // ✅ Add here for the popup
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  // ✅ Gift popup state
  giftVisible = false;
  gift = '';

  // 🔄 Other state
  recommendedProducts: any[] = [];
  showAll = false;

  newArrivals = [
    {
      image: "https://images.unsplash.com/photo-1734834933418-97049d256943?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fDRrJTIwY2FzdWFsJTIwdCUyMHNoaXJ0JTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Casual T-shirt",
      bgColor: "#ff4d77"
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1729777212449-df1c8c065dd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8NGslMjAlMjBmYXNoaW9uJTIwcHJlbWl1bSUyMHBvbG98ZW58MHx8MHx8fDA%3D",
      alt: "Premium Polo",
      bgColor: "#c8d0f8"
    },
    {
      image: "https://images.unsplash.com/photo-1625880014195-928b3ee7008b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fDRrJTIwJTIwZmFzaGlvbiUyMGNvenklMjBob29kaWV8ZW58MHx8MHx8fDA%3D",
      alt: "Cozy Hoodie",
      bgColor: "rgb(88, 68, 68)"
    },
    {
      image: "https://images.unsplash.com/photo-1668749092255-65916f579dd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fDRrJTIwJTIwZmFzaGlvbmxlYXRoZXIlMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D",
      alt: "Leather Jacket",
      bgColor: "#f9a14d"
    }
  ];

  shortDressImages = [
    { src: "https://i.pinimg.com/736x/ae/35/0e/ae350edfcb189b62704074f074d83f81.jpg", alt: "Summer Dress Front" },
    { src: "https://i.pinimg.com/736x/2d/1c/c7/2d1cc7329cd5c7ae75e6c87e4f89f617.jpg", alt: "Summer Dress Side" },
    { src: "https://i.pinimg.com/736x/9d/41/bf/9d41bfce88b9aa2d4b5acb039c908f94.jpg", alt: "Summer Dress Back" },
    { src: "https://i.pinimg.com/736x/f9/38/6c/f9386c54cb7c1656eee9fcb3799de126.jpg", alt: "Summer Dress Detail" }
  ];

  denimImages = [
    { src: "https://images.unsplash.com/photo-1519803786820-8f866133444d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D", alt: "Denim Jacket Front" },
    { src: "https://plus.unsplash.com/premium_photo-1698260795012-99a7785109d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D", alt: "Denim Jacket Back" },
    { src: "https://images.unsplash.com/photo-1614697688184-66a55d41e298?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRlbmltJTIwamFja2V0fGVufDB8fDB8fHww", alt: "Denim Jacket Model" },
    { src: "https://plus.unsplash.com/premium_photo-1664439709174-6ccbd3d8a8b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRlbmltJTIwamFja2V0fGVufDB8fDB8fHww", alt: "Denim Jacket Detail" }
  ];

  testimonial = {
    image: "https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY=",
    quote: "I've never felt more confident in my style choices. ASHCART not only offers stunning pieces but also helps me express who I truly am through fashion.",
    author: "Sarah Johnson, Fashion Enthusiast"
  };

  ngOnInit() {
    // ✅ Show gift if user is new
    const isNewUser = localStorage.getItem('isNewUser') === 'true';
    const giftFromStorage = localStorage.getItem('gift');
    if (isNewUser && giftFromStorage) {
      this.giftVisible = true;
      this.gift = giftFromStorage;
      localStorage.removeItem('isNewUser');
      localStorage.removeItem('gift');
    }

    // ✅ Existing code for product recommendations
    this.productService.getRecommendations().subscribe({
      next: (res) => {
        this.recommendedProducts = res && res.length > 0 ? res : [];
      },
      error: () => {
        console.log('🔒 User not logged in, no recommendations');
        this.recommendedProducts = [];
      }
    });

    this.typeText(["Your Style, Your Story", "Fashion Meets Expression", "Be Bold. Be You."]);
  }

  closeGiftPopup() {
    this.giftVisible = false;
  }

  typeText(textArray: string[]) {
    let i = 0;
    let j = 0;
    let currentText = '';
    let isDeleting = false;
    const speed = 80;
    const typedTextEl = document.querySelector('.typed-text') as HTMLElement;

    const type = () => {
      if (!typedTextEl) return;

      if (i < textArray.length) {
        if (!isDeleting && j <= textArray[i].length) {
          currentText = textArray[i].substring(0, j++);
          typedTextEl.innerHTML = currentText;
        } else if (isDeleting && j >= 0) {
          currentText = textArray[i].substring(0, j--);
          typedTextEl.innerHTML = currentText;
        }

        if (j === textArray[i].length) {
          isDeleting = true;
          setTimeout(type, 1000);
          return;
        }

        if (j === 0) {
          isDeleting = false;
          i++;
          if (i === textArray.length) i = 0;
        }

        setTimeout(type, isDeleting ? speed / 2 : speed);
      }
    };

    type();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`🛍️ ${product.name} added to cart!`);
  }
}

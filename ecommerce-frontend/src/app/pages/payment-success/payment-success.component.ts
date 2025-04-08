import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ⏳ Redirect after 5 seconds (optional)
    setTimeout(() => {
      this.router.navigate(['/view-orders']);
    }, 5000);
  }

  goToOrders() {
    this.router.navigate(['/view-orders']);
  }
}

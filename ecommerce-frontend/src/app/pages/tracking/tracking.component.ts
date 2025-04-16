import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Add this for date pipe, ngIf, ngFor, ngClass

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule], // ✅ Required for pipes, *ngIf, *ngFor, [ngClass], etc.
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  orderId: string = '';
  order: any = null;
  errorMessage: string = '';
  loading: boolean = false; // ✅ Add this line

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      this.fetchOrder(this.orderId);
    });
  }

  fetchOrder(id: string) {
    this.loading = true;
    this.http.get(`http://localhost:3000/orders/${id}`).subscribe({
      next: (res: any) => {
        this.order = res;
        this.loading = false;
        this.errorMessage = '';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = '❌ Order not found';
        this.order = null;
      }
    });
  }
  getTimelineSteps() {
    if (!this.order) return [];
  
    const baseTime = new Date(this.order.created_at);
    const oneHourLater = new Date(baseTime.getTime() + 60 * 60 * 1000);
    const twoHoursLater = new Date(baseTime.getTime() + 2 * 60 * 60 * 1000);
    const nextDay = new Date(baseTime.getTime() + 24 * 60 * 60 * 1000);
    const deliveryDate = new Date(baseTime.getTime() + 2 * 24 * 60 * 60 * 1000);
  
    const status = this.order.status;
  
    return [
      {
        title: 'Order Placed',
        time: baseTime,
        status: 'done',
        description: 'We received your order and are preparing it.'
      },
      {
        title: 'Payment Confirmed',
        time: oneHourLater,
        status: status !== 'Pending' ? 'done' : 'pending',
        description: 'Your payment was processed successfully.'
      },
      {
        title: 'Packed',
        time: twoHoursLater,
        status: status === 'In Transit' || status === 'Completed' ? 'done' : 'pending',
        description: 'Your order has been packed.'
      },
      {
        title: 'In Transit',
        time: nextDay,
        status: status === 'In Transit' ? 'active' : status === 'Completed' ? 'done' : 'pending',
        description: 'Your package is on the way.'
      },
      {
        title: 'Delivered',
        time: deliveryDate,
        status: status === 'Completed' ? 'done' : 'pending',
        description: 'Package delivered to your address.'
      }
    ];
  }
}  
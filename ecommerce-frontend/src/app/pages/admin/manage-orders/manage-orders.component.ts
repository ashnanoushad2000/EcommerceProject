import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res: any[]) => {
        this.orders = res;
      },
      error: err => {
        console.error('❌ Failed to load orders', err);
      }
    });
  }

  // ✅ Handle status change from dropdown
  onStatusChange(orderId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    const status = target.value;
    this.updateOrderStatus(orderId, status);
  }

  // ✅ Update order status via service
  updateOrderStatus(orderId: number, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
      },
      error: err => console.error('❌ Failed to update status', err)
    });
  }

  // ✅ View Modal
  openViewModal(order: any) {
    this.selectedOrder = order;
  }

  closeViewModal() {
    this.selectedOrder = null;
  }

  // ✅ Cancel Order
  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe(() => {
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        );
      });
    }
  }

  // ✅ Export orders to CSV
  exportToCSV() {
    const rows = this.orders.map(order => ({
      'Order ID': order.id,
      'Customer': order.user?.name || 'Guest',
      'Total Price (£)': order.total_price,
      'Date': new Date(order.created_at).toLocaleDateString(),
      'Status': order.status
    }));

    const headers = Object.keys(rows[0]).join(',');
    const csvRows = rows.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = 'orders.csv';
    link.click();

    URL.revokeObjectURL(url);
  }
}

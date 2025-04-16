import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  // Get all orders (Admin)
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Cancel order
  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${orderId}`);
  }

  // Place a new order
  placeOrder(productIds: number[]): Observable<any> {
    return this.http.post(this.baseUrl, { productIds });
  }

  // Get current user's orders
  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-orders`);
  }

  // Dashboard stats
  getAdminDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/dashboard`);
  }

  // Recent orders for dashboard
  getRecentOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recent`);
  }

  updateOrderStatus(id: number, status: string) {
    return this.http.patch(`${this.baseUrl}/${id}`, { status });
  }
  
  }


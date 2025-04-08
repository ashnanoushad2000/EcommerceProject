// ✅ src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-orders`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${orderId}`);
  }

  placeOrder(productIds: number[]): Observable<any> {
    return this.http.post(this.baseUrl, { productIds });
  }
}

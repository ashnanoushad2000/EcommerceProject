import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // ✅ Fetch all products (optional category filter)
  getAllProducts(category?: string): Observable<any[]> {
    if (category) {
      return this.http.get<any[]>(`${this.baseUrl}?category=${category}`);
    }
    return this.http.get<any[]>(this.baseUrl);
  }

  // ✅ Submit a product rating
  rateProduct(productId: number, rating: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${productId}/rate`, { rating });
  }

  // ✅ Get product recommendations for logged-in user
  getRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recommendations/me`);
  }

  // ✅ Admin: Add a new product
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, product);
  }

  // ✅ Admin: Update a product
  updateProduct(productId: number, updatedData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${productId}`, updatedData);
  }

  // ✅ Admin: Delete a product
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${productId}`);
  }
  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, productData);
  }
  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${productId}`);
  }
  
}

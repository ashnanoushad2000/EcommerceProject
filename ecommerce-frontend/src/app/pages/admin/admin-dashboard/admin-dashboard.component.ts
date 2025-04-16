import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalOrders = 0;
  totalProducts = 0;
  totalSales = 0;
  recentOrders: any[] = [];

  // ✅ Chart options
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: '#ccc'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#ccc'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ccc'
        }
      }
    }
  };

  // ✅ Chart data with labels + datasets
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5000, 6200, 7700, 9000, 8700, 10000],
        label: 'Sales (2025)',
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadDashboardMetrics();
    this.loadRecentOrders();
  }

  private loadDashboardMetrics(): void {
    this.orderService.getAdminDashboardMetrics().subscribe({
      next: (data: any) => {
        this.totalUsers = data.totalUsers;
        this.totalOrders = data.totalOrders;
        this.totalProducts = data.totalProducts;
        this.totalSales = data.totalSales;
        console.log('📊 Metrics loaded:', data);
      },
      error: (err: any) => console.error('❌ Failed to load metrics', err)
    });
  }

  private loadRecentOrders(): void {
    this.orderService.getRecentOrders().subscribe({
      next: (orders: any[]) => {
        this.recentOrders = orders;
        console.log('🧾 Recent orders:', orders);
      },
      error: (err: any) => console.error('❌ Failed to load recent orders', err)
    });
  }
}

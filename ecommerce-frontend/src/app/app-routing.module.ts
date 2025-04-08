import { Routes } from '@angular/router';
import { provideRouter, withComponentInputBinding } from '@angular/router';

// ✅ Import Components
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ProductsComponent } from './pages/products/products/products.component';
import { CartComponent } from './pages/cart/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders/orders.component';
import { ViewOrdersComponent } from './pages/view-orders/view-orders.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { CheckoutComponent } from './pages/checkout/checkout/checkout.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { TrackingComponent } from './pages/tracking/tracking.component';

import { NotFoundComponent } from './pages/not-found/not-found/not-found.component';

export const appRoutes: Routes = [
  // 🏠 Home
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 🔐 Auth
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // 🛍️ Shop Pages
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  // 📦 Orders
  { path: 'orders', component: OrdersComponent },
  { path: 'view-orders', component: ViewOrdersComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },

  // 🛠️ Admin
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },

  { path: 'tracking/:orderId', component: TrackingComponent },



  // ❌ 404 Not Found
  { path: '**', component: NotFoundComponent },
];

export const appRouting = [
  provideRouter(appRoutes, withComponentInputBinding()),
];

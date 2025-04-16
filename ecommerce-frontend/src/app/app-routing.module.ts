import { Routes } from '@angular/router';
import { provideRouter, withComponentInputBinding } from '@angular/router';

// ✅ Main Pages
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

// ✅ Admin Management Pages
import { ManageProductsComponent } from './pages/admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './pages/admin/manage-orders/manage-orders.component'; // ✅ FIXED HERE

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Shop
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  // Orders
  { path: 'orders', component: OrdersComponent },
  { path: 'view-orders', component: ViewOrdersComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },

  // Tracking
  { path: 'tracking/:orderId', component: TrackingComponent },

  // Admin
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/manage-products', component: ManageProductsComponent },
  { path: 'admin/manage-orders', component: ManageOrdersComponent }, // ✅ FIXED ROUTE

  // // Admin dynamic components (standalone)
  // { path: 'admin/products/new', loadComponent: () => import('./pages/admin/product-form/product-form.component').then(m => m.ProductFormComponent) },
  // { path: 'admin/products/:id/edit', loadComponent: () => import('./pages/admin/product-form/product-form.component').then(m => m.ProductFormComponent) },
  {
    path: 'confirm-email',
    loadComponent: () => import('./pages/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent)
  },
  
  // 404
  { path: '**', component: NotFoundComponent },
];

export const appRouting = [
  provideRouter(appRoutes, withComponentInputBinding()),
];

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  Body,
  SetMetadata,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ 1. Place an order (customer only)
  @Post()
  @SetMetadata('role', 'customer')
  createOrder(@Req() req, @Body('productIds') productIds: number[]) {
    return this.ordersService.placeOrder(req.user.id, productIds);
  }

  // ✅ 2. Get orders for logged-in user
  @Get('my-orders')
  @SetMetadata('role', 'customer')
  getUserOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  // ✅ 3. Optional alias (can keep or remove)
  @Get('customer')
  @SetMetadata('role', 'customer')
  getCustomerOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  // ✅ 4. Dashboard Metrics for Admin
  @Get('admin/dashboard')
  @SetMetadata('role', 'admin')
  getDashboardStats() {
    return this.ordersService.getDashboardMetrics();
  }

  // ✅ 5. Get recent orders (admin only) — must be BEFORE :id
  @Get('recent')
  @SetMetadata('role', 'admin')
  getRecentOrders() {
    return this.ordersService.getRecentOrders();
  }

  // ✅ 6. Get all orders (admin)
  @Get()
  @SetMetadata('role', 'admin')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // ✅ 7. Get order by ID (must be below /recent)
  @Get(':id')
  getOrderById(@Param('id') id: number) {
    return this.ordersService.getOrderById(id);
  }

  // ✅ 8. Update order status (admin only)
  @Patch(':id')
  @SetMetadata('role', 'admin')
  updateOrderStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  // ✅ 9. Cancel or delete order (customer or admin)
  @Delete(':id')
  deleteOrder(@Param('id') id: number) {
    return this.ordersService.deleteOrder(id);
  }
}

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { OrderProduct } from './order-product.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,

    private readonly mailService: MailService
  ) {}

  // ✅ Place an Order
  async placeOrder(userId: number, productIds: number[]): Promise<Order> {
    try {
      console.log(`📌 Placing order for user ID: ${userId} with products:`, productIds);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const products = await this.productRepository.find({ where: { id: In(productIds) } });
      if (products.length !== productIds.length) {
        const missingIds = productIds.filter(
          (id) => !products.find((p) => p.id === id),
        );
        throw new NotFoundException(`Missing products: ${missingIds.join(', ')}`);
      }

      const productCountMap: Record<number, number> = {};
      for (const id of productIds) {
        productCountMap[id] = (productCountMap[id] || 0) + 1;
      }

      let total = 0;
      for (const product of products) {
        total += Number(product.price) * productCountMap[product.id];
      }

      const order = this.orderRepository.create({
        user,
        total_price: total,
        status: 'Pending',
      });
      const savedOrder = await this.orderRepository.save(order);

      for (const product of products) {
        const orderProduct = this.orderProductRepository.create({
          product,
          quantity: productCountMap[product.id],
          order: savedOrder,
        });
        await this.orderProductRepository.save(orderProduct);
      }

      // 🔔 Send confirmation email
      await this.mailService.sendOrderConfirmationEmail(user.email, savedOrder.id);

      return this.getOrderById(savedOrder.id);
    } catch (error) {
      console.error('❌ Failed to place order:', error);
      throw new InternalServerErrorException('Order creation failed');
    }
  }

  // ✅ Get orders for logged-in user
  async getUserOrders(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderProducts', 'orderProducts.product'],
      order: { created_at: 'DESC' },
    });

    return orders.filter(order => order.orderProducts?.length > 0);
  }

  // ✅ Get order by ID
  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderProducts', 'orderProducts.product'],
    });

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  // ✅ Get all orders (admin)
  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'orderProducts', 'orderProducts.product'],
      order: { created_at: 'DESC' },
    });
  }

  // ✅ Cancel order
  async deleteOrder(id: number): Promise<{ message: string }> {
    const order = await this.getOrderById(id);
    order.status = 'Cancelled';
    await this.orderRepository.save(order);

    return { message: '✅ Order cancelled successfully' };
  }

  // ✅ Update order status (admin)
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = await this.getOrderById(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  // ✅ Dashboard Metrics (admin)
  async getDashboardMetrics(): Promise<{ totalOrders: number; totalProducts: number; totalUsers: number }> {
    try {
      const [totalOrders, totalProducts, totalUsers] = await Promise.all([
        this.orderRepository.count(),
        this.productRepository.count(),
        this.userRepository.count(),
      ]);

      return {
        totalOrders,
        totalProducts,
        totalUsers,
      };
    } catch (error) {
      console.error('❌ Failed to fetch dashboard metrics:', error);
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }

  async getRecentOrders(): Promise<Order[]> {
    try {
      const recentOrders = await this.orderRepository.find({
        relations: ['user'],
        order: { created_at: 'DESC' },
        take: 5,
      });
      console.log('📦 Recent Orders:', recentOrders);
      return recentOrders;
    } catch (error) {
      console.error('❌ Error fetching recent orders:', error);
      throw new InternalServerErrorException('Failed to fetch recent orders');
    }
  }
}

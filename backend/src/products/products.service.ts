import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './product.entity';
import { OrderProduct } from '../orders/order-product.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  async createProduct(name: string, price: number, stock: number): Promise<Product> {
    const newProduct = this.productRepository.create({ name, price, stock });
    return this.productRepository.save(newProduct);
  }

  async getAllProducts(category?: string): Promise<Product[]> {
    if (category) {
      return this.productRepository.find({
        where: { category },
        order: { created_at: 'DESC' },
      });
    }
    return this.productRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, name: string, price: number, stock: number): Promise<Product> {
    const product = await this.getProductById(id);
    product.name = name;
    product.price = price;
    product.stock = stock;
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: 'Product deleted successfully' };
  }

  async addRating(id: number, newRating: number): Promise<Product> {
    const product = await this.getProductById(id);
    const totalScore = product.rating * product.ratingCount + newRating;
    product.ratingCount += 1;
    product.rating = Math.round((totalScore / product.ratingCount) * 10) / 10;
    return this.productRepository.save(product);
 
  }
  async getRecommendedProducts(userId: number): Promise<Product[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderProducts', 'orderProducts.product'],
    });
  
    console.log(`🔍 Orders found for user ${userId}:`, orders.length);
  
    if (orders.length === 0) {
      return []; // ❌ No recommendations for users with 0 orders
    }
  
    const allProducts = orders.flatMap(order =>
      order.orderProducts.map(op => op.product)
    );
  
    const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
  
    return this.productRepository.find({
      where: { category: In(uniqueCategories) },
      take: 8,
      order: { created_at: 'DESC' },
    });
  }
}  
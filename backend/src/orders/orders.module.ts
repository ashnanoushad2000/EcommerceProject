import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { User } from '../users/user.entity'; // Import User Entity
import { Product } from '../products/product.entity'; // Import Product Entity
import { OrderProduct } from './order-product.entity';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product,OrderProduct]),
    
    MailModule,// ✅ Register repositories
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // ✅ Ensure OrdersService is available
})
export class OrdersModule {}

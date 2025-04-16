// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ProductsController } from './products.controller';
// import { ProductsService } from './products.service';
// import { Product } from './product.entity';

// import { Order } from '../orders/order.entity'; // ✅ Add this
// import { OrderProduct } from '../orders/order-product.entity'; // ✅ Add this

// @Module({
//   imports: [TypeOrmModule.forFeature([Product])],
//   controllers: [ProductsController],
//   providers: [ProductsService],
// })
// export class ProductsModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Order } from '../orders/order.entity'; // ✅ Add this
import { OrderProduct } from '../orders/order-product.entity'; // ✅ Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order, OrderProduct]) // ✅ include all needed entities
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService] // optional
})
export class ProductsModule {}

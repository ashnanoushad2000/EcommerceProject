import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';

import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'false',
        autoLoadEntities: configService.get<string>('DB_AUTOLOAD_ENTITIES') === 'true',
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
        entities: [User, Product, Order],
      }),
    }),

    AuthModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
  ],

  providers: [MailService],
  exports: [MailService], // 👈 Export MailService for use in other modules
})
export class AppModule {}

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: Number(configService.get('DB_PORT', '1433')), // ✅ Ensure it's a number
  username: configService.get<string>('DB_USERNAME', 'ecommerce_user'),
  password: configService.get<string>('DB_PASSWORD', 'ashna1273'),
  database: configService.get<string>('DB_NAME', 'ECommerceDB'),
  synchronize: false,
  logging: true,
  entities: [User, Product, Order],
  migrations: ['src/database/migrations/*.ts'],
  extra: {
    trustServerCertificate: true, // ✅ This will disable SSL validation
  },
});

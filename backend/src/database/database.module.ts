import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 1433),
        username: configService.get<string>('DB_USERNAME', 'ecommerce_user'),
        password: configService.get<string>('DB_PASSWORD', 'your_password'),
        database: configService.get<string>('DB_NAME', 'ECommerceDB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        extra: {
          trustServerCertificate: true, // Fix SSL issues
        },
      }),
    }),
  ],
})
export class DatabaseModule {}

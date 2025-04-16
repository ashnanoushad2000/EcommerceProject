
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  console.log(`🔄 Connecting to database: ${AppDataSource.options.database}`);

  const app = await NestFactory.create(AppModule);

  // ✅ Clearly added CORS configuration here
  app.enableCors({
    origin: 'http://localhost:4200',  // Allow requests clearly from Angular frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);

  console.log(`🚀 Server is running on: http://localhost:3000`);
}
bootstrap();

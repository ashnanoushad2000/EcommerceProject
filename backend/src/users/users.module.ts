import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],             // ✅ Register UsersService
  controllers: [UsersController],        // ✅ Register controller if needed
  exports: [UsersService],               // ✅ Export UsersService for use in other modules like AuthModule
})
export class UsersModule {}

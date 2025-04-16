
import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) // ✅ Protect this route
  async getProfile(@Req() req): Promise<User | null> {
    return this.usersService.findOne(req.user.email);
  }

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findOne(email);
  }
}

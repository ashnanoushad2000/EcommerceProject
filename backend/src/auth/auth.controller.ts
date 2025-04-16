import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  // ✅ Signup route
  @Post('signup')
  async signup(@Body() body: { name: string; email: string; password: string; role?: string }) {
    const { name, email, password, role } = body;
    return this.authService.signUp(name, email, password, role);
  }

  // ✅ Signin route
  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  // ✅ Email confirmation route
  @Get('confirm')
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      return res.redirect('http://localhost:4200/confirm-email?status=failed');
    }

    const user = await this.usersService.findByEmailToken(token);
    if (!user || !user.emailToken) {
      return res.redirect('http://localhost:4200/confirm-email?status=failed');
    }

    user.emailToken = null;
    user.isEmailConfirmed = true;
    await this.usersService.save(user);

    return res.redirect('http://localhost:4200/confirm-email?status=success');
  }
}

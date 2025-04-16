// ✅ auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  // ✅ Sign-Up
  async signUp(name: string, email: string, password: string, role?: string) {
    console.log('📥 Received Sign-Up Request:', { name, email, role });

    if (!password) {
      throw new Error('❌ Password is missing!');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const assignedRole = role || 'customer';

    // 🔒 Hash the password
    console.log('🔒 Hashing Password:', password);
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔑 Generate email verification token
    const emailToken = uuidv4();

    const user = this.userRepository.create({
      name,
      email,
      password_hash: hashedPassword,
      role: assignedRole,
      emailToken: emailToken,
      isEmailConfirmed: false
    });

    const savedUser = await this.userRepository.save(user);
    console.log('✅ User Created:', savedUser);

    if (!savedUser.emailToken) {
      throw new Error('Missing email confirmation token');
    }
    
    await this.mailService.sendConfirmationEmail(savedUser.email, savedUser.emailToken);
    
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    };
  }

  async signIn(email: string, password: string) {
    console.log('📥 Received Sign-In Request:', { email });
  
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException('Please confirm your email before signing in.');
    }
  
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
  
    const isNewUser = this.isNewUser(user.createdAt); // 👈 check how new the user is
    const gift = isNewUser ? '£25 OFF + Free Shipping' : null;
  
    console.log('🔑 JWT Token Generated:', accessToken);
  
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      access_token: accessToken,
      isNewUser,
      gift,
    };
  }
  
  private isNewUser(createdAt: Date): boolean {
    const hoursSinceSignup = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceSignup < 24;
  }
}  
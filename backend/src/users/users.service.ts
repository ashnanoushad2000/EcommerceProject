// ✅ users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Find all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ✅ Find one user by email
  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ✅ Find by email token (for email confirmation)
  async findByEmailToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { emailToken: token } });
  }

  // ✅ Confirm email by updating user
  async confirmEmail(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      isEmailConfirmed: true,
      emailToken: null
    });
  }
  

  // ✅ Save user (optional utility)
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}

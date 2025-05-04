import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserViewRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async updateBalance(userId: number, newBalance: number): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { 
        balance: newBalance,
        updated_at: new Date() 
      }
    );
  }
} 
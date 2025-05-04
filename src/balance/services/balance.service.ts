import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserViewRepository } from '../repositories/user-view.repository';
import { DeductBalanceCommand } from '../commands/deduct-balance.command';

@Injectable()
export class BalanceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userViewRepository: UserViewRepository,
  ) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.userViewRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user.balance;
  }

  async deductBalance(userId: number, amount: number): Promise<boolean> {
    const transactionId = uuidv4();
    
    const success = await this.commandBus.execute(
      new DeductBalanceCommand(userId, amount, transactionId, {
        initiatedAt: new Date().toISOString(),
      }),
    );
    
    return success;
  }
} 
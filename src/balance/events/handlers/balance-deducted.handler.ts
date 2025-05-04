import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BalanceDeductedEvent } from '../../domain/events/balance-deducted.event';
import { UserViewRepository } from '../../repositories/user-view.repository';

@EventsHandler(BalanceDeductedEvent)
export class BalanceDeductedEventHandler implements IEventHandler<BalanceDeductedEvent> {
  private readonly logger = new Logger(BalanceDeductedEventHandler.name);

  constructor(private readonly userViewRepository: UserViewRepository) {}

  async handle(event: BalanceDeductedEvent): Promise<void> {
    try {
      this.logger.log(
        `Processing BalanceDeductedEvent for user ${event.aggregateId}`
      );

      const userId = parseInt(event.aggregateId, 10);
      const amount = event.payload.amount;

      const user = await this.userViewRepository.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const newBalance = user.balance - amount;

      await this.userViewRepository.updateBalance(userId, newBalance);

      this.logger.log(
        `User ${userId} balance successfully decreased by ${amount}. New balance: ${newBalance}`
      );
    } catch (error) {
      this.logger.error(
        `Error when processing BalanceDeductedEvent: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
} 
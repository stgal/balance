import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeductBalanceCommand } from '../deduct-balance.command';
import { EventPublisher } from '../../services/event-publisher.service';
import { UserAggregate } from '../../domain/models/user-aggregate';
import { EventStoreRepository } from '../../repositories/event-store.repository';

@CommandHandler(DeductBalanceCommand)
export class DeductBalanceCommandHandler implements ICommandHandler<DeductBalanceCommand> {
  private readonly logger = new Logger(DeductBalanceCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly eventStoreRepository: EventStoreRepository,
  ) {}

  async execute(command: DeductBalanceCommand): Promise<boolean> {
    this.logger.log(`Processing DeductBalanceCommand for user ${command.userId}`);

    try {
      const events = await this.eventStoreRepository.getEventsForAggregate(
        'user',
        command.userId.toString()
      );
      
      const userAggregate = new UserAggregate(command.userId);
      
      events.forEach(event => userAggregate.replay(event));
      
      // Проверка чтобы не идти в бд, далее будет проверка по оптимистичной блокировке
      // но чтобы в бд не нагружать лишний раз
      if (userAggregate.getVersion() !== events.length) {
        throw new Error('Version mismatch');
      }
      
      const success = userAggregate.deductBalance(
        command.amount,
        command.transactionId,
        command.metadata
      );
      
      const uncommittedEvents = userAggregate.getUncommittedEvents();
      for (const event of uncommittedEvents) {
        await this.eventPublisher.publish(event);
      }
      
      return success;
    } catch (error) {
      this.logger.error(
        `Error when processing DeductBalanceCommand: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
} 
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BalanceDeductionFailedEvent } from '../../domain/events/balance-deduction-failed.event';

@EventsHandler(BalanceDeductionFailedEvent)
export class BalanceDeductionFailedEventHandler implements IEventHandler<BalanceDeductionFailedEvent> {
  private readonly logger = new Logger(BalanceDeductionFailedEventHandler.name);

  async handle(event: BalanceDeductionFailedEvent): Promise<void> {
    this.logger.log(
      `Processing BalanceDeductionFailedEvent for user ${event.aggregateId}`
    );

    const userId = parseInt(event.aggregateId, 10);
    const amount = event.payload.amount;
    const reason = event.payload.reason;

    this.logger.warn(
      `Failed to deduct ${amount} from user ${userId}. Reason: ${reason}`
    );

    // TODO: implement
  }
} 
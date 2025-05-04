import { BaseEvent } from './base.event';

export class BalanceDeductedEvent extends BaseEvent {
  static readonly EVENT_TYPE = 'balance.deducted';
  static readonly AGGREGATE_TYPE = 'user';

  constructor(
    userId: string,
    amount: number,
    transactionId: string,
    version: number,
    metadata?: Record<string, any>,
  ) {
    super(
      BalanceDeductedEvent.EVENT_TYPE,
      BalanceDeductedEvent.AGGREGATE_TYPE,
      userId,
      version,
      {
        amount,
        transactionId,
        timestamp: new Date().toISOString(),
      },
      metadata,
    );
  }
} 
import { BaseEvent } from './base.event';

export class BalanceDeductionFailedEvent extends BaseEvent {
  static readonly EVENT_TYPE = 'balance.deduction.failed';
  static readonly AGGREGATE_TYPE = 'user';

  constructor(
    userId: string,
    amount: number,
    transactionId: string,
    reason: string,
    version: number,
    metadata?: Record<string, any>,
  ) {
    super(
      BalanceDeductionFailedEvent.EVENT_TYPE,
      BalanceDeductionFailedEvent.AGGREGATE_TYPE,
      userId,
      version,
      {
        amount,
        transactionId,
        reason,
        timestamp: new Date().toISOString(),
      },
      metadata,
    );
  }
} 
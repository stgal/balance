export class DeductBalanceCommand {
  constructor(
    public readonly userId: number,
    public readonly amount: number,
    public readonly transactionId: string,
    public readonly metadata?: Record<string, any>,
  ) {}
} 
import { AggregateRoot } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BalanceDeductedEvent } from '../events/balance-deducted.event';
import { BalanceDeductionFailedEvent } from '../events/balance-deduction-failed.event';
import { DomainEvent } from '../events/domain-event.interface';
import { EventEntity } from '../../entities/event.entity';

export class UserAggregate extends AggregateRoot {
  private readonly logger = new Logger(UserAggregate.name);
  private id: number;
  private balance: number;
  private version: number;
  
  private uncommittedEvents: DomainEvent[] = [];

  constructor(id: number, initialBalance: number = 0) {
    super();
    this.id = id;
    this.balance = initialBalance;
    this.version = 0;
  }

  replay(event: EventEntity): void {
    let domainEvent: any;
    
    switch (event.type) {
      case BalanceDeductedEvent.EVENT_TYPE:
        domainEvent = new BalanceDeductedEvent(
          event.aggregateId,
          event.payload.amount,
          event.payload.transactionId,
          event.version,
          event.metadata || {}
        );
        break;
        
      case BalanceDeductionFailedEvent.EVENT_TYPE:
        domainEvent = new BalanceDeductionFailedEvent(
          event.aggregateId,
          event.payload.amount,
          event.payload.transactionId,
          event.payload.reason,
          event.version,
          event.metadata || {}
        );
        break;
        
      default:
        this.logger.warn(`Неизвестный тип события: ${event.type}`);
        return;
    }
    
    // Применяем событие, но не добавляем его в неподтвержденные (т.к. оно уже сохранено)
    // Используем внутренний метод для обхода добавления в uncommittedEvents
    this._apply(domainEvent);
    
    this.version = event.version;
  }

  apply(event: DomainEvent): void {
    this.uncommittedEvents.push(event);
    
    super.apply(event);
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }
  
  private _apply(event: DomainEvent): void {
    // Определяем и вызываем правильный обработчик события напрямую
    if (event instanceof BalanceDeductedEvent) {
      this.onBalanceDeductedEvent(event);
    } else if (event instanceof BalanceDeductionFailedEvent) {
      this.onBalanceDeductionFailedEvent(event);
    }
    // TODO: implement compensating events
  }

  getVersion(): number {
    return this.version;
  }

  private incrementVersion(): void {
    this.version += 1;
  }

  deductBalance(amount: number, transactionId: string, metadata?: Record<string, any>): boolean {
    if (this.balance < amount) {
      this.apply(
        new BalanceDeductionFailedEvent(
          this.id.toString(), 
          amount, 
          transactionId, 
          `Insufficient balance: current ${this.balance}, requested ${amount}`,
          this.version + 1,
          metadata,
        )
      );
      return false;
    }

    this.apply(
      new BalanceDeductedEvent(
        this.id.toString(), 
        amount, 
        transactionId, 
        this.version + 1,
        metadata,
      )
    );
    return true;
  }

  private onBalanceDeductedEvent(event: BalanceDeductedEvent): void {
    this.balance -= event.payload.amount;
    this.incrementVersion();
  }

  private onBalanceDeductionFailedEvent(event: BalanceDeductionFailedEvent): void {
    this.incrementVersion();
  }
} 
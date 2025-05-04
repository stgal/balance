import { DomainEvent } from './domain-event.interface';

export abstract class BaseEvent implements DomainEvent {
  public readonly type: string;
  public readonly aggregateType: string;
  public readonly aggregateId: string;
  public readonly version: number;
  public readonly payload: Record<string, any>;
  public readonly metadata: Record<string, any> | null;

  constructor(
    type: string,
    aggregateType: string,
    aggregateId: string,
    version: number,
    payload: Record<string, any>,
    metadata?: Record<string, any>
  ) {
    this.type = type;
    this.aggregateType = aggregateType;
    this.aggregateId = aggregateId;
    this.version = version;
    this.payload = payload;
    this.metadata = metadata || null;
  }
} 
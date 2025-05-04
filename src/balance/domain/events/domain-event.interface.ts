export interface DomainEvent {
  type: string;
  aggregateType: string;
  aggregateId: string;
  version: number;
  payload: Record<string, any>;
  metadata?: Record<string, any> | null;
} 
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventStoreRepository } from '../repositories/event-store.repository';
import { DomainEvent } from '../domain/events/domain-event.interface';

@Injectable()
export class EventPublisher {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStoreRepository: EventStoreRepository,
  ) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.eventStoreRepository.saveEvent(event);

    this.eventBus.publish(event);
  }
} 
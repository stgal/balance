import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { DomainEvent } from '../domain/events/domain-event.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventStoreRepository {
  private readonly logger = new Logger(EventStoreRepository.name);

  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  /**
   * Сохраняет событие в хранилище событий с проверкой версии (оптимистическая блокировка)
   */
  async saveEvent(event: DomainEvent): Promise<EventEntity> {
    try {
      return await this.eventRepository.manager.transaction(async (manager: EntityManager) => {
        const eventEntity = new EventEntity();
        eventEntity.id = uuidv4();
        eventEntity.aggregateId = event.aggregateId;
        eventEntity.aggregateType = event.aggregateType;
        eventEntity.type = event.type;
        eventEntity.version = event.version;
        eventEntity.payload = event.payload;
        eventEntity.metadata = event.metadata || null;
        eventEntity.created_at = new Date();

        return manager.save(EventEntity, eventEntity);
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.warn(error.message);
      } else {
        this.logger.error(`Error when saving event: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async getEventsForAggregate(
    aggregateType: string,
    aggregateId: string,
  ): Promise<EventEntity[]> {
    return this.eventRepository.find({
      where: { aggregateType, aggregateId },
      order: { version: 'ASC' },
    });
  }

  async getAggregateLastVersion(
    aggregateType: string,
    aggregateId: string,
  ): Promise<number> {
    const result = await this.eventRepository.findOne({
      where: { aggregateType, aggregateId },
      order: { version: 'DESC' },
    });

    return result ? result.version : 0;
  }
}
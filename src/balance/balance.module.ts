import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceController } from './controllers/balance.controller';

import { UserEntity } from './entities/user.entity';
import { EventEntity } from './entities/event.entity';
import { EventStoreRepository } from './repositories/event-store.repository';
import { UserViewRepository } from './repositories/user-view.repository';

import { EventPublisher } from './services/event-publisher.service';
import { BalanceService } from './services/balance.service';

import { DeductBalanceCommandHandler } from './commands/handlers/deduct-balance.handler';

import { BalanceDeductedEventHandler } from './events/handlers/balance-deducted.handler';
import { BalanceDeductionFailedEventHandler } from './events/handlers/balance-deduction-failed.handler';

const CommandHandlers = [
  DeductBalanceCommandHandler,
];

const EventHandlers = [
  BalanceDeductedEventHandler,
  BalanceDeductionFailedEventHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UserEntity,
      EventEntity,
    ]),
  ],
  controllers: [BalanceController],
  providers: [
    EventStoreRepository,
    UserViewRepository,
    EventPublisher,
    BalanceService,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class BalanceModule {} 